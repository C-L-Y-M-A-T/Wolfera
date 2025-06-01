"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { Calendar, Mail, MessageSquare, User } from "lucide-react";
import { InfoItem } from "./components";

interface AboutTabProps {
  userData: {
    username: string;
    email: string;
    bio: string;
    joinDate: string;
  };
}

export function AboutTab({ userData }: AboutTabProps) {
  const theme = useTheme();

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader>
        <CardTitle className={`text-2xl ${theme.typography.textColor.accent}`}>
          About Me
        </CardTitle>
        <CardDescription>Your profile information</CardDescription>
      </CardHeader>
      <CardContent
        className={`${theme.typography.fontSize.lg} ${theme.typography.textColor.primary}`}
      >
        <motion.div
          variants={theme.variants.container}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <InfoItem
            icon={<User className="h-4 w-4 text-red-400 mr-2" />}
            label="Username"
            value={userData.username}
          />
          <InfoItem
            icon={<Mail className="h-4 w-4 text-red-400 mr-2" />}
            label="Email"
            value={userData.email}
          />
          <InfoItem
            icon={<MessageSquare className="h-4 w-4 text-red-400 mr-2" />}
            label="Bio"
            value={userData.bio}
          />
          <InfoItem
            icon={<Calendar className="h-4 w-4 text-red-400 mr-2" />}
            label="Member Since"
            value={userData.joinDate}
          />
        </motion.div>
      </CardContent>
    </Card>
  );
}
