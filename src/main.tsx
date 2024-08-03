import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import "@/styles/style.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "@/store/index.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MantineProvider
      theme={{
        fontFamily: `"Lato", "NotoSansThai", Helvetica, Arial, sans-serif`,
      }}
    >
      <Notifications position="top-right" zIndex={1000} />
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </Provider>
);
