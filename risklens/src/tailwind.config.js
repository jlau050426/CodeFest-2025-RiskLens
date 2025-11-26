// tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          neonPulse: {
            '0%, 100%': { 
              textShadow: '0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff',
              boxShadow: '0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff',
              transform: 'scale(1)',
              opacity: '1'
            },
            '50%': { 
              textShadow: '0 0 2px #0ff, 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff',
              boxShadow: '0 0 2px #0ff, 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff',
              transform: 'scale(1.02)',
              opacity: '0.9'
            },
          },
          shine: {
            '0%': { backgroundPosition: '-200%' },
            '100%': { backgroundPosition: '200%' },
          },
          pulseGlow: { // For the progress bar
            '0%, 100%': { opacity: 0.7, boxShadow: '0 0 8px rgba(0,255,100,0.8)' },
            '50%': { opacity: 1, boxShadow: '0 0 15px rgba(0,255,100,1)' },
          }
        },
        animation: {
          neonPulse: 'neonPulse 2s ease-in-out infinite alternate',
          shine: 'shine 3s linear infinite',
          pulseGlow: 'pulseGlow 1.5s ease-in-out infinite',
        }
      },
    },
    plugins: [],
  };