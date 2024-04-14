import { useState } from "react";
import { Button, Input, Select } from "antd";

import { HTTP_VERBS, sendRequest } from "./api/requests";
import { useMutation } from "@tanstack/react-query";
import ResponseBox from "./components/ResponseBox";
import RequestBox from "./components/RequestBox";

const HTTP_VERBS_OPTIONS = [
  { value: HTTP_VERBS.GET, label: <span>GET</span> },
  { value: HTTP_VERBS.POST, label: <span>POST</span> },
  { value: HTTP_VERBS.PUT, label: <span>PUT</span> },
  { value: HTTP_VERBS.DELETE, label: <span>DELETE</span> },
];

function App() {
  const [url, setUrl] = useState("");
  const [verb, setVerb] = useState(HTTP_VERBS.GET);
  const { mutateAsync, error, data } = useMutation({
    mutationFn: sendRequest,
  });

  async function greet() {
    await mutateAsync({
      url,
      verb,
    })
      .then((e) => {
        console.log("success", e);
        console.log("response", e);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  return (
    <div className="m-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
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
        <Button htmlType="submit">Greet</Button>
      </form>

      <div className="grid grid-cols-2 mt-4">
        <RequestBox />
        <ResponseBox body={data?.body || ""} />
      </div>
    </div>
  );
}

export default App;
