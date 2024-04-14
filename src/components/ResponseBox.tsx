interface ResponseBoxProps {
  body: string;
}

export default function ResponseBox({ body }: ResponseBoxProps) {
  return <div className="border-l-[1px] p-2">{body}</div>;
}
