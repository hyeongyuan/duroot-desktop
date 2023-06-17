// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{SystemTray, SystemTrayMenu, SystemTrayEvent, Manager};
use tauri_plugin_positioner::{Position, WindowExt};
use tauri_plugin_autostart::MacosLauncher;

mod spotlight;

fn main() {
    let system_tray_menu = SystemTrayMenu::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::AppleScript, Some(vec![])))
        .invoke_handler(tauri::generate_handler![
            spotlight::init_spotlight_window
        ])
        .manage(spotlight::State::default())
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    let window: tauri::Window = app.get_window("main").unwrap();

                    let _ = window.move_window(Position::TrayBottomCenter);

                    spotlight::toggle_spotlight(window.app_handle());
                }
                _ => {}
            }
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Focused(is_focused) => {
                // detect click outside of the focused window and hide the app
                if !is_focused {
                    event.window().hide().unwrap();
                }
            }
            _ => {}
        })
        .setup(move |app| {
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
