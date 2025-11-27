import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    // Function to show the browser's native warning dialog
    const handleBeforeUnload = (event) => {
      // Modern browsers require setting the returnValue property to show the dialog
      event.returnValue =
        "Data analysis is currently running. Are you sure you want to refresh or leave? Progress may be lost!";
    };

    if (isVisible) {
      // Attach the event listener when the warning is visible (i.e., when loading is true)
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup: Remove the event listener when the component unmounts or isVisible becomes false
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="
      fixed inset-0 z-50
      flex flex-col items-center justify-center
      text-white
      backdrop-filter backdrop-blur-md
      bg-black/70
      overflow-hidden
    "
    >
      <div
        className="
        absolute inset-0 
        bg-gradient-to-br from-blue-900/40 to-purple-900/40 
        animate-pulseGlow
        opacity-50
        mix-blend-lighten
      "
      ></div>

      {/* RiskLens AI Logo - Replaces 'ANALYZING DATA...' H1 */}
      <div
        className="
        text-5xl font-extrabold tracking-tighter
        text-white
        relative z-10
        animate-neonPulse
        text-shadow-[0_0_8px_rgba(59,130,246,0.7),_0_0_15px_rgba(59,130,246,0.5)]
        flex items-center space-x-3
      "
      >
        <span className="text-blue-400">🛡️</span>
        RiskLens
        <span
          className="
          text-5xl font-extrabold tracking-tighter
          bg-gradient-to-br from-blue-500 to-green-500
          bg-clip-text 
          text-transparent
        "
        >
          AI
        </span>
      </div>

      <div
        className="
        w-80 h-3 bg-gray-700 rounded-full overflow-hidden mb-6 mt-8
        relative z-10
        shadow-inner shadow-gray-800
      "
      >
        <div
          className="
            h-full bg-gradient-to-r from-green-400 to-teal-400 
            rounded-full 
            animate-pulseGlow
            absolute left-0 top-0
            box-shadow-[0_0_8px_rgba(52,211,153,0.7),_0_0_15px_rgba(52,211,153,0.5)]
          "
          style={{ width: "60%" }}
        ></div>
        <div
          className="
          absolute inset-0 
          bg-gradient-to-r from-transparent via-white/50 to-transparent 
          opacity-70 
          animate-shine
        "
        ></div>
      </div>

      <p
        className="
        text-xl font-mono text-gray-400 
        relative z-10
        text-shadow-[0_0_5px_rgba(156,163,175,0.4)]
      "
      >
        Waiting for results...{" "}
        <span className="text-green-400 font-semibold animate-pulse">
          {elapsedTime}
        </span>{" "}
        s
      </p>

      <div className="
  p-3 rounded-lg max-w-sm text-center
  bg-yellow-900/20 text-yellow-300
  border border-yellow-500/50
  shadow-md shadow-yellow-900/30 mt-10
">
  <p className="font-bold text-lg flex items-center justify-center space-x-2 mb-1">
    <span className="text-xl">🐹</span>
    <span>Please Don't Hit F5!</span>
  </p>
  <p className="text-sm">
    Our little AI hamster is running the risk analysis right now, and if you hit refresh, he has to start his treadmill all over again.
  </p>
</div>
    </div>
  );
};

export default SplashScreen;
