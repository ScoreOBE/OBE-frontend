/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#6869AD",
        secondary: "#5768D5",
        tertiary: "#3E3E3E",
        hover: "#efefef",
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
      manrope: ["Oxygen"],
    },
  },
  plugins: [],
};
