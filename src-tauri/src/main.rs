// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_positioner::{Position, WindowExt};

fn main() {
  let system_tray_menu = SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

  tauri::Builder::default()
    .plugin(tauri_plugin_autostart::init(MacosLauncher::AppleScript, Some(vec![])))
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
          let tray_window = app.get_window("main").unwrap();

          if tray_window.is_visible().unwrap() {
            tray_window.hide().unwrap();
          } else {
            tray_window.move_window(Position::TrayCenter).unwrap();
            tray_window.show().unwrap();
            tray_window.set_focus().unwrap();
          }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
          "quit" => {
              std::process::exit(0);
          }
          _ => {}
        },
        _ => {}
      }
    })
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::Focused(is_focused) => {
          // detect click outside of the focused window and hide the app
          if !is_focused {
              // event.window().hide().unwrap();
          }
      }
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
