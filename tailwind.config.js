/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {},
    fontFamily: {
      "sf-pro": ["SF Pro"],
      "sf-pro-rounded": ["SF Pro Rounded"],
      notoThai: ["NotoSansThai"],
    },
  },
  plugins: [],
};
