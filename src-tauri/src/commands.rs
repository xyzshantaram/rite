use rand::Rng;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use std::{
    fs::OpenOptions,
    io::Write,
    path::{Path, PathBuf},
};

use crate::{args, ARGS};

#[tauri::command]
pub fn get_args() -> args::Args {
    ARGS.as_ref().clone()
}

#[tauri::command]
pub fn get_config_dir() -> PathBuf {
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
pub fn get_config_path() -> PathBuf {
    let mut dir = get_config_dir();
    dir.push("config.json");
    dir
}

#[tauri::command]
pub fn log(line: String) {
    println!("{}", line);
}

#[tauri::command]
pub fn dir_exists(path: PathBuf) -> bool {
    Path::new(&path).is_dir()
}

#[tauri::command]
pub fn exists(path: PathBuf) -> bool {
    Path::new(&path).exists()
}

#[tauri::command]
pub fn get_platform() -> String {
    std::env::consts::OS.into()
}

#[tauri::command]
pub fn ensure_parent_dir(path: PathBuf) {
    if path.is_dir() {
        return;
    }
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .unwrap_or_else(|e| panic!("Error trying to create dir {}: {:#?}", path.display(), e));
    }
}

#[tauri::command]
pub fn atomic_write(target: String, contents: String) -> Result<(), String> {
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
pub struct FetchResponse {
    body: String,
    status: u16,
    ok: bool,
}

#[tauri::command]
pub async fn rite_fetch(
    url: String,
    method: String,
    body: Option<String>,
) -> Result<FetchResponse, serde_json::Value> {
    let client = reqwest::ClientBuilder::new()
        .user_agent(format!("rite text editor v{}", env!("CARGO_PKG_VERSION")))
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

use relative_path::RelativePath;
use std::env::current_dir;

fn e_to_string(e: std::io::Error) -> String {
    format!("{:#?}", e)
}

#[tauri::command]
pub fn normalize_path(path: String) -> Result<PathBuf, String> {
    let root = current_dir().map_err(e_to_string)?;
    let relative_path = RelativePath::new(&path);
    let full_path = relative_path.to_path(&root);
    Ok(full_path)
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    let full_path = normalize_path(path)?;
    std::fs::read_to_string(full_path).map_err(e_to_string)
}
