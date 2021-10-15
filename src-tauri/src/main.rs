#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rand::Rng;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;
use std::path::PathBuf;

use tauri::{Event, Manager};

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

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_config_dir,
            log,
            dir_exists,
            get_config_path,
            get_platform,
            atomic_write
        ])
        .build(tauri::generate_context!())
        .expect("Error building application.");

    app.run(|handle, e| match e {
        Event::CloseRequested { label, api, .. } => {
            let window = handle.get_window(&label).unwrap();
            api.prevent_close();
            let _ = window.emit("closerequest", ());
        }
        _ => {}
    });
}
