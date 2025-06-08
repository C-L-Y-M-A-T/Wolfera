"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";
import type { ReactNode } from "react";

interface GameCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "profile";
  headerAction?: ReactNode;
}

export function GameCard({
  title,
  icon,
  children,
  className = "",
  variant = "primary",
  headerAction,
}: GameCardProps) {
  const { gameStyles, colors, typography } = useTheme();

  const cardClass =
    variant === "profile"
      ? gameStyles.cards.profile
      : variant === "secondary"
        ? gameStyles.cards.default
        : gameStyles.cards.highlighted;

  return (
    <Card className={`${cardClass} ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle
            className={`text-xl ${typography.textColor.accent} flex items-center`}
          >
            {icon && (
              <span className={`mr-2 ${typography.textColor.accent}`}>
                {icon}
              </span>
            )}
            {title}
          </CardTitle>
          {headerAction}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
