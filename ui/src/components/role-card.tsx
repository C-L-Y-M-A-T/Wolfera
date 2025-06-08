"use client";

import { Badge } from "@/components/ui/badge";
import { Role } from "@/data/roles";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface RoleCardProps {
  role: Role;
  onClick?: () => void;
  showDetails?: boolean;
  index?: number;
}

export function RoleCard({
  role,
  onClick,
  showDetails = true,
  index = 0,
}: RoleCardProps) {
  const { colors, typography } = useTheme();
  const { getRoleIcon, getRoleColorClass } = useRoleStyles();

  const roleColorClass = getRoleColorClass(role.name);
  const roleIcon = getRoleIcon(role.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      onClick={onClick}
      className={`p-4 rounded-lg border ${roleColorClass} backdrop-blur-sm ${
        onClick ? "cursor-pointer" : ""
      } transition-all duration-300 hover:shadow-lg`}
      aria-label={onClick ? `View details about ${role.name} role` : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {roleIcon}
          <span className="font-medium">{role.name}</span>
        </div>
        <Badge
          variant="secondary"
          className={`text-xs ${
            role.team === "Evil"
              ? `bg-${colors.gradients.danger}/50 ${typography.textColor.danger}`
              : `bg-${colors.gradients.greenToGreen}/50 text-${typography.textColor.success}`
          }`}
        >
          {role.team}
        </Badge>
      </div>
      <p className={`text-xs ${typography.textColor.muted} mb-2`}>
        {role.shortDescription}
      </p>
      {showDetails && onClick && (
        <div className="flex items-center justify-between">
          <span className={`text-xs ${typography.textColor.info}`}>
            Click for details
          </span>
          <ChevronRight className={`h-3 w-3 ${typography.textColor.info}`} />
        </div>
      )}
    </motion.div>
  );
}
