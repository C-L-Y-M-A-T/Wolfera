import { AnimatedText, GameAccessModal } from "@/components";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-32 md:py-40 relative overflow-hidden">
      {/* Animated blood splatter effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-red-600/20 rounded-full blur-3xl"
            style={{
              width: `${30 + i * 20}%`,
              height: `${30 + i * 20}%`,
              top: `${10 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-4xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedText
            text={t("home.title")}
            type="werewolf"
            color="text-red-500"
            size="text-6xl md:text-7xl lg:text-8xl"
            intensity="high"
            className="font-display"
          />
        </motion.div>

        <motion.div
          className="text-xl md:text-2xl mb-8 font-light tracking-wide text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <AnimatedText
            text={t("home.subtitle")}
            type="flicker"
            color="text-gray-200"
            size="text-xl md:text-2xl"
            delay={0.5}
            className={`font-light tracking-wide`}
          />
        </motion.div>

        <div className="relative mt-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <GameAccessModal
              trigger={
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6 shadow-lg shadow-red-600/30 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center">
                    {t("common.play")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </Button>
              }
            />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center mt-16 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-sm text-gray-300 mb-2">Scroll to discover</span>
          <ArrowDownIcon className="h-6 w-6 text-red-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
