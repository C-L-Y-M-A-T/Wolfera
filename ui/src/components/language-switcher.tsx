"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import theme from "@/lib/theme/theme-config";
import { Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "en", name: t("languages.en") },
    { code: "fr", name: t("languages.fr") },
    { code: "ar", name: t("languages.ar") },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">
            {t(`languages.${i18n.language}`)}
          </span>
          <span className="sr-only">
            {t("common.language")} -{" "}
            {languages.find((lang) => lang.code === i18n.language)?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-gray-900 border-gray-700"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center justify-between text-white hover:bg-gray-800 ${
              i18n.language === language.code ? "bg-gray-800" : ""
            } hover:text-[${theme.colors.primary.night}] cursor-pointer `}
          >
            <span>{language.name}</span>
            {i18n.language === language.code && (
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
