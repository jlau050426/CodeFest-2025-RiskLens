// SplashScreen.jsx
import React, { useState, useEffect } from 'react';

const SplashScreen = ({ isVisible }) => {
  const [elapsedTime, setElapsedTime] = useState(0); 

  useEffect(() => {
    let timerInterval;

    if (isVisible) {
      const startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime((elapsed / 1000).toFixed(1));
      }, 100);
    } else {
        setElapsedTime(0);
        clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval);
  }, [isVisible]);

  if (!isVisible) {
    return null; 
  }

  return (
    <div className="
      fixed inset-0 z-50 
      flex flex-col items-center justify-center
      text-white
      backdrop-filter backdrop-blur-md 
      bg-black-800               
      overflow-hidden             
    ">
      {/* Background Overlay for a subtle glow effect */}
      <div className="
        absolute inset-0 
        bg-gradient-to-br from-blue-900/40 to-purple-900/40 
        animate-pulseGlow-bg
        opacity-50
        mix-blend-lighten
      "></div>
      
      {/* App Logo/Name with Neon Pulse */}
      <h1 className="
        text-6xl font-extrabold mb-8 
        text-blue-400                    // Base color for text
        tracking-wider                   // Spacing
        relative z-10                    // Ensure it's above background effects
        animate-neonPulse                // Apply neon pulse animation
        // Custom text shadow for initial neon look before animation
        text-shadow-[0_0_8px_rgba(59,130,246,0.7),_0_0_15px_rgba(59,130,246,0.5)]
      ">
        PROJECT ALPHA
      </h1>

      {/* Loading Bar with Glowing Pulse */}
      <div className="
        w-80 h-3 bg-gray-700 rounded-full overflow-hidden mb-6
        relative z-10
        shadow-inner shadow-gray-800
      ">
        <div 
          className="
            h-full bg-gradient-to-r from-green-400 to-teal-400 
            rounded-full 
            animate-pulseGlow // Apply glowing pulse animation
            absolute left-0 top-0
            // Initial neon box shadow for progress
            box-shadow-[0_0_8px_rgba(52,211,153,0.7),_0_0_15px_rgba(52,211,153,0.5)]
          "
          // This width will be controlled by your actual loading progress,
          // here it's just a placeholder for the animation
          style={{ width: '60%' }} // Example: a fixed width for demonstration
        ></div>
        {/* Shine effect over the progress bar */}
        <div className="
          absolute inset-0 
          bg-gradient-to-r from-transparent via-white/50 to-transparent 
          opacity-70 
          animate-shine // Apply shine animation
        "></div>
      </div>
      
      {/* Timer Display with Subtle Glow */}
      <p className="
        text-xl font-mono text-gray-400 
        relative z-10
        text-shadow-[0_0_5px_rgba(156,163,175,0.4)] // Subtle text shadow for glow
      ">
        Waiting for results... <span className="text-green-400 font-semibold animate-pulse">{elapsedTime}</span> s
      </p>

    </div>
  );
};

export default SplashScreen;