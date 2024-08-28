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
import { BrowserRouter as Router, RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { quantum } from "ldrs";
import router from "./routes/router.tsx";

quantum.register();

const theme = createTheme({
  fontFamily: `"Manrope", "NotoSansThai", Helvetica, Arial, sans-serif`,
  primaryColor: "slate-blue",
  colors: {
    "slate-blue": [
      "#f2f4fc",
      "#d9ddf5",
      "#bfc6ef",
      "#a6afe9",
      "#8c98e2",
      "#7381dc",
      "#5768d5",
      "#4053cf",
      "#3043bf",
      "#2a3aa6",
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MantineProvider theme={theme}>
      <Notifications position="top-center" className="w-fit" zIndex={1000} />
      <RouterProvider router={router} />
    </MantineProvider>
  </Provider>
);
