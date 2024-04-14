use reqwest::StatusCode;

#[derive(Debug, serde::Deserialize)]
pub struct CallRequest {
    url: String,
    verb: Verb,
}

#[derive(Debug, serde::Serialize)]
pub struct CallResponse {
    status: u16,
    body: String,
}

#[derive(Debug, serde::Deserialize)]
pub enum Verb {
    GET,
    POST,
    PUT,
    DELETE,
}

#[tauri::command]
pub async fn send_request(params: CallRequest) -> Result<CallResponse, CallResponse> {
    println!("Received request VERB: {:?}", params.verb);
    // let url = params.url;
    let url = "http://localhost:3000/v1/chat-message";

    match params.verb {
        Verb::GET => match reqwest::get(url).await {
            Ok(resp) => match resp.status() {
                StatusCode::OK => {
                    println!("StatusCode::OK: {:?}", resp);

                    let body = resp.text().await.unwrap();

                    return Ok(CallResponse { status: 200, body });
                }
                StatusCode::NOT_FOUND => {
                    println!("StatusCode::NOT_FOUND: {:?}", resp);

                    return Err(CallResponse {
                        status: 404,
                        body: resp.text().await.unwrap(),
                    });
                }
                _ => {
                    panic!("Not implemented")
                }
            },
            Err(e) => Err(CallResponse {
                status: 500,
                body: e.to_string(),
            }),

            _ => {
                panic!("Not implemented")
            }
        },
        _ => {
            panic!("Not implemented")
        }
    }
}
