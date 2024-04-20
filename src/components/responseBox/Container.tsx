import { Tabs, TabsProps } from "antd";

import EmptyState from "./EmptyState";
import BodyRenderer from "./BodyRenderer";
import { HeadersResponse } from "../../api/requests";

interface ResponseBoxProps {
  body?: string;
  headers?: HeadersResponse;
}

export default function ResponseBox({ body, headers }: ResponseBoxProps) {
  if (!body) {
    return <EmptyState />;
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Response",
      children: <BodyRenderer body={body} />,
    },
    {
      key: "2",
      label: "Headers",
      children: <div>HEADER</div>,
    },
  ];

  return (
    <div className="border-l-[1px] p-2">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
