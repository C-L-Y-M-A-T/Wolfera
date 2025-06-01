"use client";

import { AvatarPreview } from "@/components/avatar-builder/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";
import { AvatarConfigType } from "@/types/avatar-builder/avatarConfig";
import { motion } from "framer-motion";
import { Heart, MessageSquare } from "lucide-react";

interface FriendsCardProps {
  friends: Array<{
    id: string;
    username: string;
    status: string;
    avatarOptions: Record<keyof AvatarConfigType, number>;
  }>;
}

export function FriendsCard({ friends }: FriendsCardProps) {
  const theme = useTheme();

  return (
    <motion.div variants={theme.variants.card}>
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-red-500 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Friends
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className={` ${theme.typography.textColor.primary}`}>
          <motion.div
            variants={theme.variants.container}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {friends.map((friend) => (
              <motion.div
                key={friend.id}
                variants={theme.variants.item}
                whileHover={{ x: 5 }}
                className={theme.gameStyles.friends.item}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <AvatarPreview
                      className={theme.gameStyles.friends.avatar}
                      currentOptions={friend.avatarOptions}
                    />

                    <div
                      className={`${theme.gameStyles.friends.statusDot.base} ${
                        Object.keys(theme.colors.status).includes(friend.status)
                          ? theme.colors.status[
                              friend.status as keyof typeof theme.colors.status
                            ]
                          : theme.colors.status.offline
                      }`}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{friend.username}</div>
                    <div className="text-xs capitalize text-gray-400">
                      {friend.status}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
