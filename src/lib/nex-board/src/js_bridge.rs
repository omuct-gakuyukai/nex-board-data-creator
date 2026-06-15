use std::collections::VecDeque;
use std::sync::Mutex;
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

static COMMAND_QUEUES: Mutex<VecDeque<(String, String)>> = Mutex::new(VecDeque::new());

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn send_command(instance_id: &str, json: &str) {
    COMMAND_QUEUES
        .lock()
        .unwrap()
        .push_back((instance_id.to_string(), json.to_string()));
}

// Bevyシステムから呼び出す関数
pub fn pop_command() -> Option<(String, String)> {
    COMMAND_QUEUES.lock().unwrap().pop_front()
}
