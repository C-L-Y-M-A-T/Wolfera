"use client";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 text-white">
        {/* <Navbar /> */}
        <main className="container mx-auto px-4 py-12">
          {/* <HeroSection />
          <FeaturesSection />
          <HowToPlaySection /> */}
        </main>
        <footer className="bg-gray-900/80 backdrop-blur-sm py-6 text-center text-gray-400 border-t border-gray-800">
          <p>
            ©{new Date().getFullYear()} {t("home.title")}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
