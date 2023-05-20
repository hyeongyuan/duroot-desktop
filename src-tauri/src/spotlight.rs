use std::sync::{Mutex, Once};

use tauri::{
    AppHandle, Manager, Window, Wry,
};

use cocoa::{
    appkit::{NSMainMenuWindowLevel, NSWindowCollectionBehavior},
    base::{id, nil, BOOL, YES},
};

use objc::{
    class, msg_send,sel, sel_impl,
    declare::ClassDecl, Message,
    runtime::{self, Class, Object, Sel},
};
use objc_id::{Id, ShareId};
use objc_foundation::INSObject;

#[derive(Default)]
pub struct Store {
    panel: Option<ShareId<RawNSPanel>>,
}

#[derive(Default)]
pub struct State(pub Mutex<Store>);

#[macro_export]
macro_rules! set_state {
    ($app_handle:expr, $field:ident, $value:expr) => {{
        let handle = $app_handle.app_handle();
        handle
            .state::<$crate::spotlight::State>()
            .0
            .lock()
            .unwrap()
            .$field = $value;
    }};
}

#[macro_export]
macro_rules! get_state {
    ($app_handle:expr, $field:ident) => {{
        let handle = $app_handle.app_handle();
        let value = handle
            .state::<$crate::spotlight::State>()
            .0
            .lock()
            .unwrap()
            .$field;

        value
    }};
    ($app_handle:expr, $field:ident, $action:ident) => {{
        let handle = $app_handle.app_handle();
        let value = handle
            .state::<$crate::spotlight::State>()
            .0
            .lock()
            .unwrap()
            .$field
            .$action();

        value
    }};
}

#[macro_export]
macro_rules! panel {
    ($app_handle:expr) => {{
        let handle = $app_handle.app_handle();
        let panel = handle
            .state::<$crate::spotlight::State>()
            .0
            .lock()
            .unwrap()
            .panel
            .clone();

        panel.unwrap()
    }};
}

#[macro_export]
macro_rules! nsstring_to_string {
    ($ns_string:expr) => {{
        use objc::{sel, sel_impl};
        let utf8: id = unsafe { objc::msg_send![$ns_string, UTF8String] };
        let string = if !utf8.is_null() {
            Some(unsafe {
                {
                    std::ffi::CStr::from_ptr(utf8 as *const std::ffi::c_char)
                        .to_string_lossy()
                        .into_owned()
                }
            })
        } else {
            None
        };

        string
    }};
}

static INIT: Once = Once::new();

#[tauri::command]
pub fn init_spotlight_window(app_handle: AppHandle<Wry>, window: Window<Wry>) {
    INIT.call_once(|| {
        set_state!(app_handle, panel, Some(create_spotlight_panel(&window)));
    });
}

pub fn toggle_spotlight(app_handle: AppHandle<Wry>) {
    let panel = panel!(app_handle);
    if panel.is_visible() {
        panel.order_out(None);
    } else {
        panel.show();
    }
}

extern "C" {
    pub fn object_setClass(obj: id, cls: id) -> id;
}

#[allow(non_upper_case_globals)]
const NSWindowStyleMaskNonActivatingPanel: i32 = 1 << 7;

const CLS_NAME: &str = "RawNSPanel";

pub struct RawNSPanel;

impl RawNSPanel {
    fn get_class() -> &'static Class {
        Class::get(CLS_NAME).unwrap_or_else(Self::define_class)
    }

    fn define_class() -> &'static Class {
        let mut cls = ClassDecl::new(CLS_NAME, class!(NSPanel))
            .unwrap_or_else(|| panic!("Unable to register {} class", CLS_NAME));

        unsafe {
            cls.add_method(
                sel!(canBecomeKeyWindow),
                Self::can_become_key_window as extern "C" fn(&Object, Sel) -> BOOL,
            );
        }

        cls.register()
    }

    /// Returns YES to ensure that RawNSPanel can become a key window
    extern "C" fn can_become_key_window(_: &Object, _: Sel) -> BOOL {
        YES
    }
}
unsafe impl Message for RawNSPanel {}

impl RawNSPanel {
    fn show(&self) {
        self.make_first_responder(Some(self.content_view()));
        self.order_front_regardless();
        self.make_key_window();
    }

    fn is_visible(&self) -> bool {
        let flag: BOOL = unsafe { msg_send![self, isVisible] };
        flag == YES
    }

    fn make_key_window(&self) {
        let _: () = unsafe { msg_send![self, makeKeyWindow] };
    }

    fn order_front_regardless(&self) {
        let _: () = unsafe { msg_send![self, orderFrontRegardless] };
    }

    fn order_out(&self, sender: Option<id>) {
        let _: () = unsafe { msg_send![self, orderOut: sender.unwrap_or(nil)] };
    }

    fn content_view(&self) -> id {
        unsafe { msg_send![self, contentView] }
    }

    fn make_first_responder(&self, sender: Option<id>) {
        if let Some(responder) = sender {
            let _: () = unsafe { msg_send![self, makeFirstResponder: responder] };
        } else {
            let _: () = unsafe { msg_send![self, makeFirstResponder: self] };
        }
    }

    fn set_level(&self, level: i32) {
        let _: () = unsafe { msg_send![self, setLevel: level] };
    }

    fn set_style_mask(&self, style_mask: i32) {
        let _: () = unsafe { msg_send![self, setStyleMask: style_mask] };
    }

    fn set_collection_behavior(&self, behavior: NSWindowCollectionBehavior) {
        let _: () = unsafe { msg_send![self, setCollectionBehavior: behavior] };
    }

    /// Create an NSPanel from Tauri's NSWindow
    fn from(ns_window: id) -> Id<Self> {
        let ns_panel: id = unsafe { msg_send![Self::class(), class] };
        unsafe {
            object_setClass(ns_window, ns_panel);
            Id::from_retained_ptr(ns_window as *mut Self)
        }
    }
}

impl INSObject for RawNSPanel {
    fn class() -> &'static runtime::Class {
        RawNSPanel::get_class()
    }
}

fn create_spotlight_panel(window: &Window<Wry>) -> ShareId<RawNSPanel> {
    // Convert NSWindow Object to NSPanel
    let handle: id = window.ns_window().unwrap() as _;
    let panel = RawNSPanel::from(handle);
    let panel = panel.share();

    // Set panel above the main menu window level
    panel.set_level(NSMainMenuWindowLevel + 1);

    // Ensure that the panel can display over the top of fullscreen apps
    panel.set_collection_behavior(
        NSWindowCollectionBehavior::NSWindowCollectionBehaviorTransient
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorMoveToActiveSpace
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
    );

    // Ensures panel does not activate
    panel.set_style_mask(NSWindowStyleMaskNonActivatingPanel);

    panel
}
