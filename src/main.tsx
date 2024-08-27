import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme, MantineProvider, virtualColor } from "@mantine/core";
import "./index.css";
import "@/styles/style.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "@/store/index.ts";
import { BrowserRouter as Router } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { quantum } from "ldrs";

quantum.register();

const theme = createTheme({
  fontFamily: `"Manrope", "NotoSansThai", Helvetica, Arial, sans-serif`,
  primaryColor: "cmu",
  colors: {
    cmu: [
      "#1e244b",
      "#272f60",
      "#343e80",
      "#414ea0",
      "#4653aa",
      "#4e5ec0",
      "#5768d5",
      "#cbd0f2",
      "#e6e8f9",
      "#eef0fb",
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MantineProvider theme={theme}>
      <Notifications position="top-center" className="w-fit" zIndex={1000} />
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </Provider>
);
