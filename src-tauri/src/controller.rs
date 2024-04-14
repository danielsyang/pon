use reqwest::{Response, StatusCode};

pub enum Status {
    OK,
    NOTFOUND,
}

#[derive(serde::Serialize)]
pub struct PonError {
    message: String,
}

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
pub async fn send_request(params: CallRequest) -> Result<CallResponse, PonError> {
    println!("Received request VERB: {:?}", params.verb);
    // let url = params.url;
    let url = "http://localhost:3000/";

    match params.verb {
        Verb::GET => match reqwest::get(url).await {
            Ok(resp) => match resp.status() {
                StatusCode::OK => {
                    println!("StatusCode::OK: {:?}", resp);

                    return Ok(CallResponse {
                        status: 200,
                        body: "Hello".to_string(),
                    });
                }
                StatusCode::NOT_FOUND => {
                    println!("StatusCode::NOT_FOUND: {:?}", resp);

                    return Ok(CallResponse {
                        status: 404,
                        body: "Not found".to_string(),
                    });
                }
                _ => {
                    panic!("Not implemented")
                }
            },
            Err(e) => Err(PonError {
                message: e.to_string(),
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
