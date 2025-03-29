/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        banner: "url('/images/spider-man.jpg')", // Chỉ cần sử dụng đường dẫn từ thư mục public
        gradient: "url('/images/gradient.png')",
      },
      fontFamily: {
        custom: ["MyCustomFont", "sans-serif"],
        custom1: ["MyCustomFont1"],
        custom_bold: ["MyCustomFont2"],
        custom_semi: ["MyCustomFont3"],
      },
    },
  },
};
