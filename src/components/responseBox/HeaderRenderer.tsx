import { match, P } from "ts-pattern";
import { HeadersSchemaType } from "../../api/requests";

import { Table, TableProps } from "antd";

interface HeaderRendererProps {
  headers: HeadersSchemaType | null;
}

interface DataType {
  key: string;
  name: string;
  value: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

export default function HeaderRenderer({ headers }: HeaderRendererProps) {
  const data = match(headers)
    .with(P.nullish, () => [])
    .with(P.nonNullable, (headersMap) => {
      return Object.entries(headersMap).map(([key, value]) => {
        return {
          key,
          name: key,
          value: value.toString(),
        };
      });
    })
    .exhaustive();

  return <Table columns={columns} dataSource={data} />;
}
