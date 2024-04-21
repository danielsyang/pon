import JsonView from "react18-json-view";

import "react18-json-view/src/style.css";
import { match } from "ts-pattern";

interface BodyRendererProps {
  status: number;
  body: string;
}

interface BodyMessageProps {
  message: string;
}

export default function BodyRenderer({ body, status }: BodyRendererProps) {
  return match(status)
    .with(200, () => <JsonView src={JSON.parse(body)} />)
    .otherwise(() => <BodyMessage message={body} />);
}

function BodyMessage({ message }: BodyMessageProps) {
  return <div>Invalid request: {message}</div>;
}
