"use client";

import { LanguageSwitcher, useTheme } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Bell, HelpCircle, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, checkingSession } = useAuth();
  const isLoggedIn = !!user;
  const theme = useTheme();
  const router = useRouter();

  const handleConnectClick = () => {
    if (isLoggedIn) {
      router.push(`/dashboard/${user.id}`);
      return;
    }
    router.push("/auth");
  };

  if (checkingSession) return null;

  return (
    <nav
      className={`bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 py-4 sticky top-0 z-50 ${theme.typography.textColor.primary}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-red-500 mr-8 flex items-center"
          >
            <Image
              src="/wolf.png"
              alt="Wolf icon"
              width={40}
              height={40}
              className="mr-2"
            />
            {t("home.title")}
          </Link>
          <div className="hidden md:flex space-x-6">
            <NavLink
              href="/"
              icon={<Home size={18} />}
              label={t("common.home")}
            />
            {isLoggedIn && (
              <NavLink
                href="/notifications"
                icon={<Bell size={18} />}
                label={t("common.notifications")}
              />
            )}
            <NavLink
              href="/help"
              icon={<HelpCircle size={18} />}
              label={t("common.help")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
            onClick={handleConnectClick}
          >
            {t("common.connect")}
          </Button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center text-gray-300 transition-colors hover:text-red-400"
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
