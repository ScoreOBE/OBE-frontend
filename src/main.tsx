import ReactDOM from "react-dom/client";
import { Button, createTheme, MantineProvider } from "@mantine/core";
import "./index.css";
import "@/styles/style.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "@/store/index.ts";
import { BrowserRouter as Router, RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { quantum, grid, infinity, ping, hourglass } from "ldrs";
import router from "./routes/router.tsx";

quantum.register();
grid.register();
infinity.register();
ping.register();
hourglass.register();

const theme = createTheme({
  cursorType: "pointer",
  fontFamily: `"Manrope", "NotoSansThai", Helvetica, Arial, sans-serif`,
  primaryColor: "slate-blue",
  colors: {
    "slate-blue": [
      "#bad1fb",
      "#98baf9",
      "#699bf7",
      "#4c87f5",
      "#1f69f3",
      "#1c60dd",
      "#1f69f3",
      "#1c60dd",
      "#164bad",
      "#113a86",
    ],
  },
  components: {
    Button: Button.extend({
      vars: (theme, props) => {
        if (props.variant == "subtle") {
          return {
            root: {
              "--button-bg": "transparent",
              "--button-color": "#575757",
              "--button-hover": "rgba(87, 87, 87, 0.12)",
              "--button-bd": "transparent",
            },
          };
        }
        return { root: {} };
      },
    }),
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
