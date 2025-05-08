const colors = require('./src/colors');
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/features/**/*.{js,jsx,ts,tsx}',
    ],
    // @ts-ignore
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors,
        },
    },
    plugins: [],
};
