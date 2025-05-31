"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  type?: "default" | "typewriter" | "reveal" | "flicker" | "blood" | "werewolf";
  className?: string;
  color?: string;
  size?: string;
  delay?: number;
  speed?: number;
  intensity?: "low" | "medium" | "high";
}

interface IntensitySettings {
  scale: number;
  y: number;
}

interface BloodDropProps {
  index: number;
}

interface WerewolfTextProps {
  text: string;
  color: string;
  size: string;
  delay: number;
  intensity: IntensitySettings;
}

interface BloodTextProps {
  text: string;
  color: string;
  size: string;
  delay: number;
}

interface FlickerTextProps {
  text: string;
  color: string;
  size: string;
  delay: number;
}

interface RevealTextProps {
  text: string;
  color: string;
  size: string;
  delay: number;
}

interface TypewriterTextProps {
  text: string;
  color: string;
  size: string;
  delay: number;
  speed: number;
}

interface DefaultTextProps {
  text: string;
  color: string;
  size: string;
  delay: number;
  intensity: IntensitySettings;
}

export default function AnimatedText({
  text,
  type = "default",
  className = "",
  color = "text-red-500",
  size = "text-4xl",
  delay = 0,
  speed = 0.03,
  intensity = "medium",
}: AnimatedTextProps) {
  // Intensity settings for different animation strengths
  const intensitySettings = {
    low: { scale: 1.05, y: 2 },
    medium: { scale: 1.1, y: 4 },
    high: { scale: 1.2, y: 6 },
  };

  const intensityValues =
    intensitySettings[intensity] || intensitySettings.medium;

  // Render different animation types
  const renderText = () => {
    switch (type) {
      case "typewriter":
        return (
          <TypewriterText
            text={text}
            color={color}
            size={size}
            delay={delay}
            speed={speed}
          />
        );
      case "reveal":
        return (
          <RevealText text={text} color={color} size={size} delay={delay} />
        );
      case "flicker":
        return (
          <FlickerText text={text} color={color} size={size} delay={delay} />
        );
      case "blood":
        return (
          <BloodText text={text} color={color} size={size} delay={delay} />
        );
      case "werewolf":
        return (
          <WerewolfText
            text={text}
            color={color}
            size={size}
            delay={delay}
            intensity={intensityValues}
          />
        );
      default:
        return (
          <DefaultText
            text={text}
            color={color}
            size={size}
            delay={delay}
            intensity={intensityValues}
          />
        );
    }
  };

  return <div className={`relative ${className}`}>{renderText()}</div>;
}

// Blood drop effect (for horror theme)
const BloodDrop = ({ index: index }: BloodDropProps) => {
  const delayValue = index * 0.2 + Math.random() * 0.3;
  const durationValue = 1.5 + Math.random() * 1;

  return (
    <motion.div
      className="absolute top-0 w-1 bg-red-600 rounded-full blur-[1px] opacity-0"
      style={{
        height: `${10 + Math.random() * 15}px`,
        left: `${5 + Math.random() * 80}%`,
      }}
      initial={{ y: -5, opacity: 0 }}
      animate={{
        y: 30,
        opacity: [0, 0.8, 0],
      }}
      transition={{
        delay: delayValue,
        duration: durationValue,
        repeat: Infinity,
        repeatDelay: 3 + Math.random() * 5,
      }}
    />
  );
};

// Default text animation with subtle float
const DefaultText = ({
  text,
  color,
  size,
  delay,
  intensity,
}: DefaultTextProps) => {
  return (
    <motion.div
      className={`font-bold ${color} ${size} drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      <motion.span
        animate={{ y: [0, -intensity.y, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

// Typewriter effect
const TypewriterText = ({
  text,
  color,
  size,
  delay,
  speed,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed * 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    // Reset when text prop changes
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <motion.div
      className={`font-bold ${color} ${size} drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block"
      >
        |
      </motion.span>
    </motion.div>
  );
};

// Text reveal letter by letter
const RevealText = ({ text, color, size, delay }: RevealTextProps) => {
  return (
    <motion.div
      className={`font-bold ${color} ${size} drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] overflow-hidden`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <div className="flex overflow-hidden">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: delay + index * 0.05,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

// Flickering horror text
const FlickerText = ({ text, color, size, delay }: FlickerTextProps) => {
  return (
    <motion.div
      className={`font-bold ${color} ${size} drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.span
        animate={{
          opacity: [1, 0.7, 1, 0.3, 1, 0.5, 1],
          textShadow: [
            "0 0 10px rgba(255,0,0,0.5)",
            "0 0 5px rgba(255,0,0,0.3)",
            "0 0 15px rgba(255,0,0,0.7)",
            "0 0 5px rgba(255,0,0,0.3)",
            "0 0 10px rgba(255,0,0,0.5)",
          ],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

// Blood dripping text
const BloodText = ({ text, color, size, delay }: BloodTextProps) => {
  // Generate a random number of blood drops
  const bloodDrops = Array.from({ length: Math.floor(text.length / 3) + 1 });

  return (
    <div className="relative">
      <motion.div
        className={`font-bold ${color} ${size} drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] relative`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
      >
        {text}
      </motion.div>
      {bloodDrops.map((_, index) => (
        <BloodDrop key={index} index={index} />
      ))}
    </div>
  );
};

// Werewolf transform text effect
const WerewolfText = ({
  text,
  color,
  size,
  delay,
  intensity,
}: WerewolfTextProps) => {
  return (
    <motion.div
      className={`font-bold ${color} ${size} drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
    >
      <div className="relative">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block relative"
            animate={{
              scale: [1, intensity.scale, 1],
              y: [0, -intensity.y / 2, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.08,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
