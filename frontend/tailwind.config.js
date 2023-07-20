/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        fontFamily: {
            poppins: ["poppins", "serif"],
        },
        extend: {
            colors: {
                "lightGray": "#D3D3D3",
                "purple": "#6842EF"
            },
        },
    },
    plugins: [],
};