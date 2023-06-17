use tauri::{api::notification::Notification, AppHandle, Runtime};

use std::thread;
use std::time::Duration;

use job_scheduler::{JobScheduler, Job};

pub fn init<R: Runtime>(app_handle: AppHandle<R>) {
  thread::spawn(move || {
    let mut schedule = JobScheduler::new();

    schedule.add(Job::new("1/10 * * * * *".parse().unwrap(), || {
      println!("hello");

      Notification::new(&app_handle.config().tauri.bundle.identifier)
        .title("New message")
        .body("You've got a new message.")
        .show()
        .unwrap();
    }));

    loop {
      schedule.tick();

      std::thread::sleep(Duration::from_millis(500));
    }
  });
}
