use reqwest::{header::HeaderMap, Error, Response, StatusCode};

#[derive(Debug, serde::Deserialize)]
pub struct ActionRequest {
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
pub async fn send_action(params: ActionRequest) -> Result<ActionResponse, ErrorResponse> {
    let client = reqwest::Client::new();
    let url = params.url;
    // let url = "http://localhost:3000/v1/chat-message";

    match params.verb {
        Verb::GET => match client.get(url).send().await {
            Ok(resp) => response_validator(resp).await,
            Err(e) => unexpected_error_builder(e),
        },

        Verb::POST => match client.post(url).send().await {
            Ok(resp) => response_validator(resp).await,
            Err(e) => unexpected_error_builder(e),
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

async fn response_validator(resp: Response) -> Result<ActionResponse, ErrorResponse> {
    match resp.status() {
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
        not_ok => expected_error_builder(resp, not_ok.as_u16()).await,
    }
}

fn unexpected_error_builder(error: Error) -> Result<ActionResponse, ErrorResponse> {
    Err(ErrorResponse {
        status: 500,
        body: error.to_string(),
        headers: None,
    })
}

async fn expected_error_builder(
    response: Response,
    status_number: u16,
) -> Result<ActionResponse, ErrorResponse> {
    let response_header = response.headers().clone();
    let headers = get_header_object(response_header);

    return Err(ErrorResponse {
        status: status_number,
        body: response.text().await.unwrap(),
        headers: Some(headers),
    });
}
