#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn get_config_dir() -> std::path::PathBuf {
  let key = "RITE_DATA_DIR";

  return match std::env::var_os(key) {
      Some(val) => val.into(),
      None => dirs::config_dir().unwrap_or_default()
  };
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_config_dir])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
