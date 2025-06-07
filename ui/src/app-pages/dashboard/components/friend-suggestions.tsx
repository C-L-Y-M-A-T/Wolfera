"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { Heart, MessageSquare, User, UserPlus } from "lucide-react";

interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: string;
}

interface FriendSuggestionsProps {
  friends: Friend[];
  recentPlayers: Friend[];
  onViewProfile: (userId: string) => void;
  onSendFriendRequest: (userId: string) => void;
}

export function FriendSuggestions({
  friends,
  recentPlayers,
  onViewProfile,
  onSendFriendRequest,
}: FriendSuggestionsProps) {
  const theme = useTheme();

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-red-400 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Friends & Players
        </CardTitle>
      </CardHeader>
      <CardContent className={`${theme.typography.textColor.primary}`}>
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="recent">Recent Players</TabsTrigger>
          </TabsList>
          <TabsContent value="friends">
            <motion.div
              variants={theme.variants.container}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  variants={theme.variants.item}
                  whileHover={{ x: 5 }}
                  className={theme.gameStyles.friends.item}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={friend.avatar || "/placeholder.svg"}
                        alt={friend.username}
                        className={theme.gameStyles.friends.avatar}
                      />
                      <div
                        className={`${theme.gameStyles.friends.statusDot.base} ${
                          theme.colors.status[
                            friend.status as keyof typeof theme.colors.status
                          ]
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
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewProfile(friend.id)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          <TabsContent value="recent">
            <motion.div
              variants={theme.variants.container}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {recentPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  variants={theme.variants.item}
                  whileHover={{ x: 5 }}
                  className={theme.gameStyles.friends.item}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.username}
                        className={theme.gameStyles.friends.avatar}
                      />
                      <div
                        className={`${theme.gameStyles.friends.statusDot.base} ${
                          theme.colors.status[
                            player.status as keyof typeof theme.colors.status
                          ]
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{player.username}</div>
                      <div className="text-xs capitalize text-gray-400">
                        {player.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewProfile(player.id)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onSendFriendRequest(player.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
