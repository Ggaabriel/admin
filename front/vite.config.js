/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
      extend: {
          colors: {
              gray: "rgba(238, 238, 238, 0.72)",
          },
          boxShadow: {
              md: "0 4px 4px 0px rgba(0, 0, 0, 0.25)",
              inner: "-15px 16px 31px 0px rgba(0, 0, 0, 0.25) inset",
              my: "0px 10px 20px rgba(0, 0, 0, 0.5)",
          },
          keyframes: {
              shake: {
                  "0%, 100%": { transform: "rotate(-0.5deg)" },
                  "50%": { transform: "rotate(0.5deg)" },
              },
          },
          animation: {
              shake: "shake 0.25s infinite;",
          },
          backgroundImage: {
              bg: "url('/src/assets/bg/bg.png')",
          },
      },
  },
  plugins: [],
};
