import JsonView from "react18-json-view";

import "react18-json-view/src/style.css";

interface BodyRendererProps {
  body: string;
}

export default function BodyRenderer({ body }: BodyRendererProps) {
  return <JsonView src={JSON.parse(body)} />;
}
