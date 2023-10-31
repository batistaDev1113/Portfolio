/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  mode: "jit",
  content: [
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  // content: [
  //   "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  //   "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
  //   "./public/**/*.html",
  //   "./components/**/*.{js,jsx,ts,tsx}",
  //   "./app/**/*.{js,jsx,ts,tsx}",
  // ],
  theme: {
    extend: {
      fontFamily: {
        kaushan: ["Kaushan Script", "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
