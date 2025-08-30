import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        main: ["Montserrat", "sans-serif"],
        cute: ["Quicksand", "sans-serif"],
        fancy: ["MonteCarlo", "serif"],
        // title: ["Tinos", "serif"]
      },
      colors: {
        light: {
          main: "#ee6d87", //f58a9f ff80b0 f58aaf f37299 f47192 f28293 f07587 f0758e ee6d87
          main2: "#ec8398", //f7a1b2 ff99c0 f7a1bf f58aaa f688a4 f995a4 f38c9b f28ca1 ec8398
          main3: "#FFDCDC", //FFDCDC
          main4: "#FFF2EB",
          secondary: "#398e7d", //09aa89 09aa97 f10e5d f2267f f5efbc
          text1: "#000000",
          text2: "#333333", //333333
          text3: "#666666",
          bg1: "#ffffff",
          bg3: "#f7f7f7",
          bg2: "#e6e6e6",
        },
        dark: {
          main: "#F891A5",
          text1: "#ffffff",
          bg1: "#000000"
        },
      }
    },
  },
}

export default config;