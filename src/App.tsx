import React, { useState } from "react";
import { Radio, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center items-center gap-5">
        <p className="text-3xl font-semibold underline">MIS for OBE</p>
        <Radio.Group>
          <Group mt="xs" mb="xs">
            <Radio value="1" label="1" />
            <Radio value="2" label="2" />
            <Radio value="3" label="3" />
          </Group>
        </Radio.Group>
      </div>
    </>
  );
}

export default App;
