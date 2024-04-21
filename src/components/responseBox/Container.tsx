import { Tabs, TabsProps } from "antd";

import BodyRenderer from "./BodyRenderer";
import {
  ResponseFailureSchemaType,
  ResponseSchemaType,
} from "../../api/requests";
import HeaderRenderer from "./HeaderRenderer";

interface ResponseBoxProps {
  response: ResponseSchemaType | ResponseFailureSchemaType;
}

export default function ResponseBox({
  response: { body, headers, status },
}: ResponseBoxProps) {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Response",
      children: <BodyRenderer body={body} status={status} />,
    },
    {
      key: "2",
      label: "Headers",
      children: <HeaderRenderer headers={headers} />,
    },
  ];

  return (
    <div className="border-l-[1px] p-2">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
