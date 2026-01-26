/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 1. Add your modern font
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
            },
            // 2. Register the animations
            animation: {
                blob: "blob 7s infinite", // Moving background blob
                float: "float 6s ease-in-out infinite", // Gently floating cards
                "fade-in-up": "fadeInUp 0.8s ease-out forwards", // Smooth entry
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Slower pulse
            },
            // 3. Define the keyframes (The actual movement logic)
            keyframes: {
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-15px)" }, // Floats up 15px
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                }
            },
        },
    },
    plugins: [],
}