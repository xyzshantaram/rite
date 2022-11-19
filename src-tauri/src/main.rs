#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use clap::{crate_authors, crate_description, crate_version};
use rand::Rng;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use std::{
    fs::OpenOptions,
    io::Write,
    path::{Path, PathBuf},
    process::exit,
};

use tauri::{api::cli::get_matches, Event, Manager};

#[tauri::command]
fn get_config_dir() -> PathBuf {
    let key = "RITE_DIR";

    let mut default_path = dirs::config_dir().unwrap_or_default();
    default_path.push("rite");

    match std::env::var_os(key) {
        Some(val) => {
            let mut path = PathBuf::from(val);
            path.push("config");
            path
        }
        None => default_path,
    }
}

#[tauri::command]
fn get_config_path() -> PathBuf {
    let mut dir = get_config_dir();
    dir.push("config.json");
    dir
}

#[tauri::command]
fn log(line: String) {
    println!("{}", line);
}

#[tauri::command]
fn dir_exists(path: PathBuf) -> bool {
    Path::new(&path).is_dir()
}

#[tauri::command]
fn exists(path: PathBuf) -> bool {
    Path::new(&path).exists()
}

#[tauri::command]
fn get_platform() -> String {
    std::env::consts::OS.into()
}

#[tauri::command]
fn atomic_write(target: String, contents: String) -> Result<(), String> {
    let mut rng = rand::thread_rng();
    let mut n: u64 = rng.gen();

    if std::path::Path::new(&target).is_dir() {
        return Err("Path exists and is a dir!".into());
    }

    let mut random_path = format!("{}.tmp-{}", target, n);
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&random_path);
    while file.is_err() {
        n = rng.gen();
        random_path = format!("{}.tmp-{}", target, n);
        file = OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&random_path);
    }

    match file {
        Ok(mut handle) => {
            if let Err(err) = handle.write(contents.as_bytes()) {
                return Err(err.to_string());
            } else {
                drop(handle);
            }

            if let Err(rename_err) = std::fs::rename(&random_path, target) {
                if let Err(rm_err) = std::fs::remove_file(&random_path) {
                    return Err(rm_err.to_string());
                } else {
                    return Err(rename_err.to_string());
                }
            }
        }
        Err(err) => {
            return Err(err.to_string());
        }
    }
    Ok(())
}

#[derive(Serialize, Deserialize)]
struct FetchResponse {
    body: String,
    status: u16,
    ok: bool,
}

#[tauri::command]
async fn rite_fetch(
    url: String,
    method: String,
    body: Option<String>,
) -> Result<FetchResponse, serde_json::Value> {
    let client = reqwest::ClientBuilder::new()
        .user_agent(format!("rite text editor v{}", crate_version!()))
        .build()
        .unwrap_or_default();
    let mut builder = if method == "POST" {
        client.post(url)
    } else {
        client.get(url)
    };

    if body.is_some() {
        builder = builder.body(body.unwrap_or_default());
    }

    let res = builder.send().await;

    match res {
        Ok(val) => {
            let status = val.status();

            let body: String = val.text().await.unwrap_or_else(|_| {
                serde_json::json!({
                    "message": "rite_fetch: error getting response body"
                })
                .to_string()
            });

            Ok(FetchResponse {
                status: status.as_u16(),
                ok: status == StatusCode::OK,
                body,
            })
        }
        Err(err) => Err(serde_json::json!({
            "message": format!("rite_fetch: error {}", err)
        })),
    }
}

fn main() {
    let context = tauri::generate_context!();
    let cli_config = context.config().tauri.cli.clone().unwrap();
    let info = context.package_info();

    if let Ok(matches) = get_matches(&cli_config, info) {
        if matches.args.get("help").is_some() {
            let about = cli_config
                .description()
                .unwrap_or(&crate_description!().to_string())
                .to_string();

            // Workaround for tauri issue #2982
            clap::App::new("rite")
                .version(crate_version!())
                .author(crate_authors!())
                .about(&*about)
                .setting(clap::AppSettings::AllowMissingPositional)
                .arg(
                    clap::Arg::with_name("version")
                        .short("V")
                        .long("version")
                        .takes_value(false)
                        .help("Display app version and license information."),
                )
                .arg(
                    clap::Arg::with_name("help")
                        .short("h")
                        .long("help")
                        .takes_value(false)
                        .help("Display this help."),
                )
                .arg(clap::Arg::with_name("filename").help("The name of a file to open."))
                .print_help()
                .unwrap_or(());
            println!("\n");
            exit(0);
        }
        if matches.args.get("version").is_some() {
            println!("rite text editor -- v{}", crate_version!());
            println!("Copyright © 2021 Siddharth Singh under the terms of the MIT License");
            exit(0);
        }
    };

    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_config_dir,
            log,
            dir_exists,
            get_config_path,
            get_platform,
            atomic_write,
            exists,
            rite_fetch
        ])
        .build(context)
        .expect("Error building application.");

    app.run(|handle, e| {
        if let Event::CloseRequested { label, api, .. } = e {
            let window = handle.get_window(&label).unwrap();
            api.prevent_close();
            let _ = window.emit("closerequest", ());
        }
    });
}
