/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        default: "#333333",
        primary: "#164bad",
        secondary: "#1f69f3",
        tertiary: "#3e3e3e",
        emphasize: "#1D1D1F",
        deemphasize: "#6e6e73",
        done: "#059061",
        save: "#13A9A1",
        label: "#424242",
        noData: "#ababab",
        edit: "#f39d4e",
        delete: "#ff4747",
        bgTableHeader: "#dfebff",
        hover: "#efefef",
        error: "#fa5252",
        disable: "#f1f3f5",
      },
      screens: {
        iphone: "330px",
        sm: "1024px",
        ipad11: "1180px",
        acerSwift: "1200px",
        macair133: "1280px",
        samsungA24: "1800px",
      },
      fontSize: {
        h1: "20px",
        h2: "18px",
        b1: "16px",
        b2: "14px",
        b3: "13px",
        b4: "12px",
        b5: "11px",
        b6: "10px",
      },
    },
    fontFamily: {
      notoThai: ["NotoSansThai"],
      manrope: ["Manrope"],
    },
  },
  plugins: [],
};
