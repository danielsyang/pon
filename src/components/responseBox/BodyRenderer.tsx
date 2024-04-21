import JsonView from "react18-json-view";
import { match, P } from "ts-pattern";

import "react18-json-view/src/style.css";

interface BodyRendererProps {
  status: number;
  body: string;
}

interface BodyMessageProps {
  message: string;
}

function isParseable(body: string) {
  try {
    JSON.parse(body);
    return true;
  } catch (e) {
    return false;
  }
}

export default function BodyRenderer({ body, status }: BodyRendererProps) {
  return match([status, isParseable(body)])
    .with([P.any, true], () => <JsonView src={JSON.parse(body)} />)
    .with([200, true], () => <JsonView src={JSON.parse(body)} />)
    .otherwise(() => <BodyMessage message={body} />);
}

function BodyMessage({ message }: BodyMessageProps) {
  return <div>Invalid request: {message}</div>;
}
