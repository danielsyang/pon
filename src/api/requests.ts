import { invoke } from "@tauri-apps/api/tauri";
import { z } from "zod";

export const QUERY_KEYS = {
  SEND_ACTION: "send_action",
};

export enum HTTP_VERBS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const requestSchema = z.object({
  url: z.string(),
  verb: z.nativeEnum(HTTP_VERBS),
});

const headersSchema = z.object({
  xPoweredBy: z.string(),
  contentType: z.string(),
  contentLength: z.number(),
  etag: z.string(),
  connection: z.string(),
});

const responseSchema = z.object({
  status: z.number(),
  headers: headersSchema,
  body: z.string().transform((str, ctx) => {
    try {
      JSON.parse(str);
      return str;
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON response" });
      return z.NEVER;
    }
  }),
});

const responseFailureSchema = z.object({
  status: z.number(),
  headers: headersSchema.nullable(),
  body: z.string(),
});

export type ResponseSchemaType = z.infer<typeof responseSchema>;
export type HeadersSchemaType = z.infer<typeof headersSchema>;
export type RequestSchemaType = z.infer<typeof requestSchema>;
export type ResponseFailureSchemaType = z.infer<typeof responseFailureSchema>;

export async function sendRequest({
  url,
  verb,
}: RequestSchemaType): Promise<ResponseSchemaType | ResponseFailureSchemaType> {
  try {
    const result = await invoke("send_action", {
      params: {
        url,
        verb,
      },
    });

    return responseSchema.parse(result);
  } catch (e) {
    return responseFailureSchema.parse(e);
  }
}
