"use client";

import { AnimatedText, GameAccessModal, Navbar } from "@/components";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDownIcon, EyeIcon, MoonIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for parallax and navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[url('/moon-forest.jpg')] bg-cover bg-center bg-fixed overflow-hidden">
      <div className={`min-h-screen backdrop-brightness-[0.3] text-white`}>
        <Navbar />
        <main className="container mx-auto px-4">
          <HeroSection />
          <FeaturesSection />
          <HowToPlaySection />
          <TestimonialsSection />
        </main>
        <footer className="bg-gray-900/80 backdrop-blur-md py-8 border-t border-red-900/30 mt-16">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-red-500 mb-4">
                {t("home.title")}
              </h3>
              <p className="text-gray-400 mb-2">{t("home.subtitle")}</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Rules
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-2">
                Stay updated with the latest news and game updates.
              </p>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 w-full"
                />
                <Button className="bg-red-600 hover:bg-red-700 rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-8 pt-6 border-t border-gray-800">
            <p>
              © {new Date().getFullYear()} {t("home.title")}. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function HeroSection() {
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

function FeaturesSection() {
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

function HowToPlaySection() {
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

function TestimonialsSection() {
  // Mock testimonials
  const testimonials = [
    {
      name: "Alex K.",
      role: "Werewolf Champion",
      content:
        "The most intense online werewolf experience I've had. The night phases are genuinely suspenseful!",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      name: "Mira J.",
      role: "Village Elder",
      content:
        "I've been playing werewolf games for years, and this is the best implementation I've seen. The roles are perfectly balanced.",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      name: "Carlos T.",
      role: "Strategy Gamer",
      content:
        "The social deduction elements shine in this version. I love how tense each vote becomes!",
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-5xl"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-red-400">
          <span className="relative inline-block">
            What Players Are Saying
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></span>
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="bg-gray-900/60 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 relative"
            >
              <div className="absolute top-0 right-0 -mt-3 -mr-3 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6 italic">{testimonial.content}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-red-500"
                />
                <div className="ml-4">
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-red-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
