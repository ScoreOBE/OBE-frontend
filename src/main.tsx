import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import "@/styles/style.css";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "@/store/index.ts";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MantineProvider
      theme={{
        fontFamily: `"SF Pro", "NotoSansThai", Helvetica, Arial, sans-serif`,
      }}
    >
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </Provider>
);
