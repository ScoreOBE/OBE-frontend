import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "@/styles/style.css";
import "./index.css";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "@/store/index.ts";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MantineProvider>
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </Provider>
);
