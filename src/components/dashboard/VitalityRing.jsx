import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

export default function VitalityRing({ score, size = 120 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Dark Elegance theme colors
  const getColor = (value) => {
    if (value >= 80) return "#34d399"; // emerald-400
    if (value >= 60) return "#c9a962"; // gold / amber-400
    return "#f87171"; // red-400
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div
      className="relative bg-white/[0.05] rounded-full"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle - transparent with subtle stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-white/60">/ 100</span>
      </div>
    </div>
  );
}
