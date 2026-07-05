// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         cream: '#FDFBF7',
//         alabaster: '#F5F2EB',
//         border: '#E6E2D8',
//         charcoal: '#2A2621',
//         umber: '#70695E',
//         terracotta: {
//           DEFAULT: '#C07A62',
//           light: '#D9A88F',
//           dark: '#A65F48',
//         },
//         sage: {
//           DEFAULT: '#8F9779',
//           light: '#B5BBA0',
//           dark: '#6B7354',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//       },
//       borderRadius: {
//         xl: '12px',
//         lg: '8px',
//       },
//       boxShadow: {
//         soft: '0 2px 8px rgba(42, 38, 33, 0.04)',
//         elevated: '0 4px 16px rgba(42, 38, 33, 0.08)',
//       },
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Your Core Palette
        cream: '#F7F1DE',       // Eggshell
        sage: {
          DEFAULT: '#B0BA99',   // Dry Sage
          dark: '#8C9776',      // Darker sage for hover states
          light: '#D3D8C8',     // Lighter sage for backgrounds
        },
        terracotta: {
          DEFAULT: '#9D6638',   // Toffee Brown
          dark: '#7D512C',      // Darker brown for hover states
          light: '#D3BFA9',     // Lighter brown for backgrounds
        },
        charcoal: '#4E220F',    // Dark Walnut (Primary Text)
        
        // Supplementary UI Colors
        umber: '#8A7363',       // Secondary Text
        border: '#E8DFD1',      // Subtle Borders
        alabaster: '#FFFFFF',   // Card Backgrounds
      },
      boxShadow: {
        'elevated': '0 4px 20px -2px rgba(78, 34, 15, 0.08)',
      }
    },
  },
  plugins: [],
};