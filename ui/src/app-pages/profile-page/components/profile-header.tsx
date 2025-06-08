"use client";

import AnimatedText from "@/components/animated-text";
import { AvatarPreview } from "@/components/avatar-builder/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { AvatarConfigType } from "@/types/avatar-builder/avatarConfig";
import { UserData } from "@/types/profile/profile-header.types";
import { motion } from "framer-motion";
import { Calendar, Camera, Edit, Skull, Trophy } from "lucide-react";

interface ProfileHeaderProps {
  userData: UserData;
  onEditProfile: () => void;
  onEditAvatar: () => void;
  avatarOptions: Record<keyof AvatarConfigType, number>;
}

export function ProfileHeader({
  userData,
  onEditProfile,
  onEditAvatar,
  avatarOptions,
}: ProfileHeaderProps) {
  const theme = useTheme();
  const { avatar } = theme.gameStyles;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mb-8 overflow-hidden rounded-xl"
    >
      <div className={theme.gameStyles.backgrounds.header.gradient} />
      <div
        className="h-48 w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
        }}
      />
      <div className={theme.gameStyles.backgrounds.header.fadeBottom} />

      <div className="relative -mt-20 flex flex-col md:flex-row items-center md:items-end px-6 pb-4">
        {/* Avatar Container - Using Theme Styles */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className={`${avatar.container} flex-shrink-0`}
        >
          {/* Glow Effect */}
          <div className={avatar.glow} />

          {/* Avatar Image */}
          <div className={`${avatar.image} overflow-hidden`}>
            <AvatarPreview
              currentOptions={avatarOptions}
              className="w-full h-full bg-white"
            />
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="icon"
            className={avatar.editButton}
            onClick={onEditAvatar}
          >
            <Camera className="h-4 w-4 text-red-500" />
          </Button>

          {/* Level Badge - uncomment if needed */}
          {/* <div className={avatar.levelBadge}>LVL {userData.level}</div> */}
        </motion.div>

        {/* User Info */}
        <div className="mt-6 md:mt-0 md:ml-6 text-center md:text-left flex-grow">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnimatedText
              text={userData.username}
              type="werewolf"
              className="text-3xl font-bold text-white"
              color="text-white"
              size="text-3xl"
              intensity="medium"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2"
          >
            <Badge
              variant="outline"
              className={theme.gameStyles.badges.default}
            >
              <Calendar className="h-3 w-3 mr-1" /> Joined {userData.created_at}
            </Badge>
            <Badge
              variant="outline"
              className={theme.gameStyles.badges.default}
            >
              <Trophy className="h-3 w-3 mr-1" /> {userData.stats.wins} Wins
            </Badge>
            <Badge className={theme.gameStyles.badges.kill}>
              <Skull className="h-3 w-3 mr-1" /> {userData.stats.killCount}{" "}
              Kills
            </Badge>
          </motion.div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-4 md:mt-0 md:ml-auto">
          <Button
            variant="outline"
            size="sm"
            className={theme.gameStyles.buttons.edit}
            onClick={onEditProfile}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* XP Progress bar */}
      <ProfileXpBar level={userData.level} xp={userData.xp} />
    </motion.div>
  );
}

interface ProfileXpBarProps {
  level: number;
  xp: number;
}

function ProfileXpBar({ level, xp }: ProfileXpBarProps) {
  const theme = useTheme();

  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={`${theme.typography.fontSize.sm} text-gray-300`}>
          Level {level}
        </span>
        <span className={`${theme.typography.fontSize.sm} text-gray-300`}>
          Level {level + 1}
        </span>
      </div>
      <div className={theme.gameStyles.progressBar.container}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(xp, 0), 100)}%` }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className={theme.gameStyles.progressBar.fill}
        />
      </div>
      <div className="text-center text-xs text-gray-400 mt-1">
        {xp}% to next level
      </div>
    </div>
  );
}
