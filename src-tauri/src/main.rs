#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn get_config_dir() -> std::path::PathBuf {
  let key = "RITE_DIR";

  let mut default_path = dirs::config_dir().unwrap_or_default();
  default_path.push("rite");

  match std::env::var_os(key) {
      Some(val) => {
        let mut path = std::path::PathBuf::from(val);
        path.push("config");
        path
      }
      None => default_path
  }
}

#[tauri::command]
fn log(line: String) {
  println!("{}", line);
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_config_dir])
    .invoke_handler(tauri::generate_handler![log])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
