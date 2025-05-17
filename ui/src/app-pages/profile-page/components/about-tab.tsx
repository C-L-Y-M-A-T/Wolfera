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
        <CardTitle className={`text-2xl text-red-500`}>About Me</CardTitle>
        <CardDescription>Your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={theme.variants.container}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div
            variants={theme.variants.item}
            className={theme.gameStyles.cards.infoItem}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 text-red-400 mr-2" />
                <h3 className="font-medium text-sm text-gray-400">Username</h3>
              </div>
              <p
                className={`${theme.typography.fontSize.lg} ${theme.typography.textColor.primary}`}
              >
                {userData.username}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={theme.variants.item}
            className={theme.gameStyles.cards.infoItem}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4">
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 text-red-400 mr-2" />
                <h3 className="font-medium text-sm text-gray-400">Email</h3>
              </div>
              <p className="text-lg">{userData.email}</p>
            </div>
          </motion.div>

          <motion.div
            variants={theme.variants.item}
            className={theme.gameStyles.cards.infoItem}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-red-400 mr-2" />
                <h3 className="font-medium text-sm text-gray-400">Bio</h3>
              </div>
              <p className="text-lg">{userData.bio}</p>
            </div>
          </motion.div>

          <motion.div
            variants={theme.variants.item}
            className={theme.gameStyles.cards.infoItem}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-red-400 mr-2" />
                <h3 className="font-medium text-sm text-gray-400">
                  Member Since
                </h3>
              </div>
              <p className="text-lg">{userData.joinDate}</p>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
