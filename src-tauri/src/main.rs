// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, CustomMenuItem};

fn generate_tray_menu() -> SystemTrayMenu {
    let version = CustomMenuItem::new("version".to_string(), "v0.0.1").disabled();
    let preference = CustomMenuItem::new("preference".to_string(), "설정");
    let quit = CustomMenuItem::new("quit".to_string() , "종료");

    let tray_menu = SystemTrayMenu::new()
        .add_item(version)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(preference)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    
    tray_menu
}

fn main() {
    let tray_menu = generate_tray_menu();

    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "preference" => {
                        tauri::WindowBuilder::new(
                            app,
                            "Main",
                            tauri::WindowUrl::App("index.html".into())
                        ).build().expect("failed to build window");
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
