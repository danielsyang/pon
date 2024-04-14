import { invoke } from "@tauri-apps/api/tauri";

export const QUERY_KEYS = {
  SEND_REQUEST: "send_request",
};

export enum HTTP_VERBS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface SendRequestParams {
  url: string;
  verb: HTTP_VERBS;
}

interface SendRequestResponse {
  status: number;
  body: string;
}

export async function sendRequest({
  url,
  verb,
}: SendRequestParams): Promise<SendRequestResponse> {
  return invoke("send_request", {
    params: {
      url,
      verb,
    },
  });
}
