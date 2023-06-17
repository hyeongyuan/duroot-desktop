use tauri::{AppHandle, Runtime, Manager};

use std::thread;
use std::time::Duration;

use job_scheduler::{JobScheduler, Job};

pub fn init<R: Runtime>(app_handle: AppHandle<R>) {
  thread::spawn(move || {
    let mut schedule = JobScheduler::new();

    schedule.add(Job::new("0 * * * * *".parse().unwrap(), || {
      app_handle.emit_all("notification", {}).unwrap();
    }));

    loop {
      schedule.tick();

      std::thread::sleep(Duration::from_millis(500));
    }
  });
}
