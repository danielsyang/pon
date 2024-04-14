import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button, Input, Select } from "antd";

const HTTP_VERBS = [
  { value: "GET", label: <span>GET</span> },
  { value: "POST", label: <span>POST</span> },
  { value: "PUT", label: <span>PUT</span> },
  { value: "DELETE", label: <span>DELETE</span> },
];

function App() {
  const [url, setUrl] = useState("");
  const [verb, setVerb] = useState(HTTP_VERBS[0].value);

  async function greet() {
    await invoke("send_request", {
      params: {
        url,
        verb,
      },
    })
      .then((e) => {
        console.log("success", e);
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
          options={HTTP_VERBS}
          onChange={(value) => setVerb(value)}
        />
        <Input
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder="Enter your url"
        />
        <Button htmlType="submit">Greet</Button>
      </form>
    </div>
  );
}

export default App;
