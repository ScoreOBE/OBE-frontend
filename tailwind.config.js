/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        default: "#333333",
        primary: "#6869ad",
        secondary: "#5768d5",
        tertiary: "#3e3e3e",
        done: "#059061",
        save: "#13A9A1",
        label: "#424242",
        noData: "#ababab",
        edit: "#f39d4e",
        delete: "#ff4747",
        bgTableHeader: "#e5e7f6",
        hover: "#efefef",
        error: "#fa5252",
      },
      fontSize: {
        h1: "20px",
        h2: "18px",
        b1: "16px",
        b2: "14px",
        b3: "12px",
      },
    },
    fontFamily: {
      notoThai: ["NotoSansThai"],
      manrope: ["Manrope"],
    },
  },
  plugins: [],
};
