// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{SystemTray, SystemTrayMenu, SystemTrayEvent, Manager};
use tauri_plugin_positioner::{Position, WindowExt};

use cocoa::{
    appkit::{NSWindow, NSWindowCollectionBehavior},
    base::{id}
};

fn main() {
    let system_tray_menu = SystemTrayMenu::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    let window = app.get_window("main").unwrap();

                    let ns_window = window.ns_window().unwrap() as id;
                    unsafe {
                        let mut collection_behavior = ns_window.collectionBehavior();
                        collection_behavior |= NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces;

                        let _ = window.move_window(Position::TrayBottomCenter);
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }

                        ns_window.setLevel_(10000);
                    }
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
