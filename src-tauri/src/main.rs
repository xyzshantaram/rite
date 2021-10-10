#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::Path;
use std::path::PathBuf;

use tauri::{
    Event, Manager
};

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

    return dir;
}

#[tauri::command]
fn log(line: String) {
    println!("{}", line);
}

#[tauri::command]
fn dir_exists(path: PathBuf) -> bool {
    Path::new(&path).is_dir()
}

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_config_dir,
            log,
            dir_exists,
            get_config_path
        ])
        .build(tauri::generate_context!())
        .expect("Error building application.");

    app.run(|_handle, e| match e {
        Event::CloseRequested { label, api, .. } => {
            let handle = _handle.clone();
            let window = handle.get_window(&label).unwrap();
            api.prevent_close();
            window.emit("closerequest", ()).unwrap_or_default();
        }
        _ => {}
    });
}
