#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod args;
mod commands;

use std::process::exit;

use args::Args;
use clap::Parser;
use commands::*;
use tauri::{Manager, RunEvent, WindowEvent};

lazy_static::lazy_static! {
    pub static ref ARGS: Box<Args> = Box::new(Args::parse());
}

fn main() {
    if ARGS.version {
        println!("rite text editor -- v{}", env!("CARGO_PKG_VERSION"));
        println!("Copyright © 2021 Siddharth Singh under the terms of the MIT License");
        exit(0);
    }

    let builder = tauri::Builder::default();
    builder
        .invoke_handler(tauri::generate_handler![
            get_config_dir,
            log,
            dir_exists,
            get_config_path,
            get_platform,
            atomic_write,
            exists,
            rite_fetch,
            get_args,
            read_file,
            normalize_path,
            ensure_parent_dir
        ])
        .build(tauri::generate_context!())
        .expect("Error building application.")
        .run(|handle, event| {
            if let RunEvent::WindowEvent {
                label,
                event: WindowEvent::CloseRequested { api, .. },
                ..
            } = event
            {
                api.prevent_close();
                handle
                    .get_window(&label)
                    .expect("Window should not be none")
                    .emit("closerequest", ())
                    .unwrap();
            }
        });
}
