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
    VILLAGER: <Users className="h-4 w-4" />,
    WEREWOLF: <Skull className="h-4 w-4" />,
    SEER: <Eye className="h-4 w-4" />,
    HUNTER: <Axe className="h-4 w-4" />,
    WITCH: <Flask className="h-4 w-4" />,
    GUARDIAN: <Shield className="h-4 w-4" />,
  };

  // Get role icon
  const getRoleIcon = (role: string): ReactNode => {
    return roleIcons[role.toUpperCase()] || <User className="h-4 w-4" />;
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

  // Get role border class
  const getRoleBorderClass = (role: string): string => {
    const roleKey = role.toLowerCase();
    const roleBorderClasses = theme.colors?.roleBorderClasses;

    if (roleBorderClasses && roleKey in roleBorderClasses) {
      return roleBorderClasses[roleKey as keyof typeof roleBorderClasses];
    }

    return "border-gray-400";
  };

  return {
    roleIcons,
    getRoleIcon,
    getRoleColorClass,
    getRoleBorderClass,
  };
}
