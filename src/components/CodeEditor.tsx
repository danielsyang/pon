import { useCallback, useState } from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useAtom } from "jotai";
import { actionBodyAtom } from "../state/action";

export default function CodeEditor() {
  const [actionBody, setActionBody] = useAtom(actionBodyAtom);

  const onChange: ReactCodeMirrorProps["onChange"] = (value) => {
    setActionBody(value);
  };

  const onChangeCallback = useCallback(onChange, []);

  return (
    <CodeMirror
      value={actionBody}
      height="200px"
      extensions={[json()]}
      onChange={onChangeCallback}
    />
  );
}
