/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "playfair-regular": ["PlayfairDisplay-Regular", "serif"],
        "playfair-medium": ["PlayfairDisplay-Medium", "serif"],
        "playfair-semibold": ["PlayfairDisplay-SemiBold", "serif"],
        "playfair-bold": ["PlayfairDisplay-Bold", "serif"],
        "playfair-extrabold": ["PlayfairDisplay-ExtraBold", "serif"],
        "playfair-black": ["PlayfairDisplay-Black", "serif"],
        "poppins-thin": ["Poppins-Thin", "sans-serif"],
        "poppins-extralight": ["Poppins-ExtraLight", "sans-serif"],
        "poppins-light": ["Poppins-Light", "sans-serif"],
        "poppins-regular": ["Poppins-Regular", "sans-serif"],
        "poppins-medium": ["Poppins-Medium", "sans-serif"],
        "poppins-semibold": ["Poppins-SemiBold", "sans-serif"],
        "poppins-bold": ["Poppins-Bold", "sans-serif"],
        "poppins-extrabold": ["Poppins-ExtraBold", "sans-serif"],
        "poppins-black": ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};