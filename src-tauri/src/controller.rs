use reqwest::{header::HeaderMap, StatusCode};

#[derive(Debug, serde::Deserialize)]
pub struct CallRequest {
    url: String,
    verb: Verb,
}

#[derive(Debug, serde::Serialize)]
pub struct HeadersResponse {
    #[serde(rename(serialize = "xPoweredBy"))]
    x_powered_by: String,
    #[serde(rename(serialize = "contentType"))]
    content_type: String,
    #[serde(rename(serialize = "contentLength"))]
    content_length: u32,
    etag: String,
    connection: String,
}

#[derive(Debug, serde::Serialize)]
pub struct ActionResponse {
    status: u16,
    body: String,
    headers: HeadersResponse,
}

#[derive(Debug, serde::Serialize)]
pub struct ErrorResponse {
    status: u16,
    body: String,
    headers: Option<HeadersResponse>,
}

#[derive(Debug, serde::Deserialize)]
pub enum Verb {
    GET,
    POST,
    PUT,
    DELETE,
}

#[tauri::command]
pub async fn send_action(params: CallRequest) -> Result<ActionResponse, ErrorResponse> {
    println!("Received request VERB: {:?}", params.verb);
    // let url = params.url;
    let url = "http://localhost:3000/v1/chat-message";

    match params.verb {
        Verb::GET => match reqwest::get(url).await {
            Ok(resp) => match resp.status() {
                StatusCode::OK => {
                    let response = resp.headers().clone();
                    let headers = get_header_object(response);

                    let body = resp.text().await.unwrap();

                    return Ok(ActionResponse {
                        status: 200,
                        body,
                        headers,
                    });
                }
                StatusCode::NOT_FOUND => {
                    let response = resp.headers().clone();
                    let headers = get_header_object(response);

                    return Err(ErrorResponse {
                        status: 404,
                        body: resp.text().await.unwrap(),
                        headers: Some(headers),
                    });
                }
                _ => {
                    panic!("Not implemented")
                }
            },
            Err(e) => Err(ErrorResponse {
                status: 500,
                body: e.to_string(),
                headers: None,
            }),
        },
        ver => {
            panic!("Verb not implemented yet {:?}", ver)
        }
    }
}

fn get_header_object(header: HeaderMap) -> HeadersResponse {
    match (
        header.get("x-powered-by"),
        header.get("content-type"),
        header.get("content-length"),
        header.get("etag"),
        header.get("connection"),
    ) {
        (
            Some(x_powered_by),
            Some(content_type),
            Some(content_length),
            Some(etag),
            Some(connection),
        ) => HeadersResponse {
            x_powered_by: x_powered_by.to_str().unwrap().to_string(),
            content_type: content_type.to_str().unwrap().to_string(),
            content_length: content_length.to_str().unwrap().parse::<u32>().unwrap(),
            etag: etag.to_str().unwrap().to_string(),
            connection: connection.to_str().unwrap().to_string(),
        },
        _ => {
            panic!("{}", format!("Invalid headers {:?}", header));
        }
    }
}
