// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_autostart::MacosLauncher;

fn main() {
  let system_tray_menu = SystemTrayMenu::new();
  tauri::Builder::default()
    .plugin(tauri_plugin_autostart::init(MacosLauncher::AppleScript, Some(vec![])))
    .system_tray(SystemTray::new().with_menu(system_tray_menu))
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("main").unwrap();

        let _ = window.show();
      }
      _ => {}
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
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
