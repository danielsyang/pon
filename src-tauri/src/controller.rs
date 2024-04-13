#[derive(Debug, serde::Deserialize)]
pub struct CallRequest {
    url: String,
    verb: String,
}

#[tauri::command]
pub fn send_request(params: CallRequest) {
    println!("Received request URL: {:?}", params.url);
    println!("Received request VERB: {:?}", params.verb);
}
