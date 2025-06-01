"use client";

import { useTheme } from "@/providers/theme-provider";
import {
  Axe,
  Eye,
  FlaskRoundIcon as Flask,
  Shield,
  Skull,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

export function useRoleStyles() {
  const theme = useTheme();

  // Role icons mapping
  const roleIcons: Record<string, ReactNode> = {
    Villager: <Users className="h-4 w-4" />,
    Werewolf: <Skull className="h-4 w-4" />,
    Seer: <Eye className="h-4 w-4" />,
    Hunter: <Axe className="h-4 w-4" />,
    Witch: <Flask className="h-4 w-4" />,
    Guardian: <Shield className="h-4 w-4" />,
  };

  // Get role icon
  const getRoleIcon = (role: string): ReactNode => {
    return roleIcons[role] || <User className="h-4 w-4" />;
  };

  // Get role color class
  const getRoleColorClass = (role: string): string => {
    const roleKey = role.toLowerCase();
    const roleClasses = theme.colors?.roleClasses;

    if (roleClasses && roleKey in roleClasses) {
      return roleClasses[roleKey as keyof typeof roleClasses];
    }

    return "text-gray-400 bg-gray-800";
  };

  return {
    roleIcons,
    getRoleIcon,
    getRoleColorClass,
  };
}
