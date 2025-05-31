import { motion } from "framer-motion";
import { EyeIcon, MoonIcon, UsersIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("home.features.strategic.title"),
      description: t("home.features.strategic.description"),
      icon: <EyeIcon className="h-12 w-12 text-purple-500" />,
      color: "from-purple-900/50 to-purple-700/20",
      iconBg: "bg-purple-900/30",
    },
    {
      title: t("home.features.roles.title"),
      description: t("home.features.roles.description"),
      icon: <UsersIcon className="h-12 w-12 text-blue-500" />,
      color: "from-blue-900/50 to-blue-700/20",
      iconBg: "bg-blue-900/30",
    },
    {
      title: t("home.features.cycles.title"),
      description: t("home.features.cycles.description"),
      icon: <MoonIcon className="h-12 w-12 text-yellow-500" />,
      color: "from-yellow-900/50 to-yellow-700/20",
      iconBg: "bg-yellow-900/30",
    },
  ];

  return (
    <section className="py-24 relative" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-red-400">
          <span className="relative inline-block">
            {t("home.features.title")}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></span>
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ translateY: -10 }}
              className={`bg-gradient-to-br ${feature.color} backdrop-blur-md p-8 rounded-xl border border-gray-700/50 shadow-xl shadow-black/30 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <div
                className={`flex justify-center items-center w-20 h-20 ${feature.iconBg} rounded-full mb-6 relative z-10 shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-300 relative z-10 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
