import { GameAccessModal } from "@/components";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HowToPlaySection() {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("home.howToPlay.steps.1.title"),
      description: t("home.howToPlay.steps.1.description"),
    },
    {
      title: t("home.howToPlay.steps.2.title"),
      description: t("home.howToPlay.steps.2.description"),
    },
    {
      title: t("home.howToPlay.steps.3.title"),
      description: t("home.howToPlay.steps.3.description"),
    },
    {
      title: t("home.howToPlay.steps.4.title"),
      description: t("home.howToPlay.steps.4.description"),
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/20 to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container max-w-4xl mx-auto relative z-10"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-red-400">
          <span className="relative inline-block">
            {t("home.howToPlay.title")}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></span>
          </span>
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-red-600 to-red-900 hidden md:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="flex md:items-center"
              >
                <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white font-bold text-xl shadow-lg shadow-red-900/30 items-center justify-center relative z-10">
                  {index + 1}
                </div>
                <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 hover:border-red-500/30 transition-all shadow-lg shadow-black/20 flex-1 md:ml-8">
                  <div className="md:hidden flex w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white shadow-lg shadow-red-900/30 items-center justify-center mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
      </motion.div>
    </section>
  );
}
