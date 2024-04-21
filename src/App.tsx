import { useEffect, useState } from "react";
import { Button, Input, Select } from "antd";

import { HTTP_VERBS, actionSchema, sendRequest } from "./api/requests";
import { useMutation } from "@tanstack/react-query";
import ResponseBox from "./components/responseBox/Container";
import RequestBox from "./components/RequestBox";
import { match, P } from "ts-pattern";
import EmptyState from "./components/responseBox/EmptyState";
import { useAtom, useAtomValue } from "jotai";
import { actionBodyAtom, actionUriAtom, actionVerbAtom } from "./state/action";

const HTTP_VERBS_OPTIONS = [
  { value: HTTP_VERBS.GET, label: <span>GET</span> },
  { value: HTTP_VERBS.POST, label: <span>POST</span> },
  { value: HTTP_VERBS.PUT, label: <span>PUT</span> },
  { value: HTTP_VERBS.DELETE, label: <span>DELETE</span> },
];

function App() {
  const [url, setUrl] = useAtom(actionUriAtom);
  const [verb, setVerb] = useAtom(actionVerbAtom);
  const actionBody = useAtomValue(actionBodyAtom);
  const { mutateAsync, error, data } = useMutation({
    mutationFn: sendRequest,
  });

  async function onHandleAction() {
    console.log("actionBody", actionBody);
    const result = actionSchema.safeParse({
      url,
      verb,
      body: actionBody.length === 0 ? null : actionBody,
    });

    if (!result.success) {
      return;
    }

    await mutateAsync(result.data);
  }

  useEffect(() => {
    console.log("understanding", error, data);
  }, [error, data]);

  return (
    <div className="m-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onHandleAction();
        }}
      >
        <Select
          value={verb}
          className="w-[150px]"
          options={HTTP_VERBS_OPTIONS}
          onChange={(value) => setVerb(value)}
        />
        <Input
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder="Enter your url"
          status={error ? "error" : undefined}
        />
        <Button htmlType="submit">Send</Button>
      </form>

      <div className="grid grid-cols-2 mt-4">
        <RequestBox />
        {match(data)
          .with(P.nullish, () => <EmptyState />)
          .with(P.nonNullable, (resp) => <ResponseBox response={resp} />)
          .exhaustive()}
      </div>
    </div>
  );
}

export default App;
