"use client";

import type React from "react";
import Image from "next/image";
import { LanguageSwitcher } from "@/components";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, HelpCircle, Home, Skull, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Mock authentication state - in a real app, this would come from your auth provider
const useAuth = () => {
  // For demo purposes, let's assume the user is not logged in initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return {
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false),
    user: isLoggedIn
      ? { name: "WolfHunter", avatar: "/placeholder.svg?height=32&width=32" }
      : null,
  };
};

export function Navbar() {
  const { t } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-red-500 mr-8 flex items-center"
          >
            <Skull className="h-6 w-6 mr-2 text-red-500" />
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

          {isLoggedIn && user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <Link href="/connect">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                {t("common.connect")}
              </Button>
            </Link>
          )}
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

interface User {
  name: string;
  avatar?: string;
}

function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-800"
        >
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border-2 border-red-500 object-cover"
          />
          <span className="hidden md:inline">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-900 border-gray-700"
      >
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center hover:bg-gray-800">
            <User className="mr-2 h-4 w-4" />
            <span>{t("common.profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center hover:bg-gray-800"
          >
            <User className="mr-2 h-4 w-4" />
            <span>{t("common.settings")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="hover:bg-gray-800 hover:text-red-400"
        >
          {t("common.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
