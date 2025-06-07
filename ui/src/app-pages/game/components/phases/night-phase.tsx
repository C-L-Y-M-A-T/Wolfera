"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useToast } from "@/hooks/use-toast";
import type { Player } from "@/providers/game-provider";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, MessageSquare, Moon, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type NightPhaseProps = {
  currentPlayer: {
    id: string;
    name: string;
    role: string;
  };
  players: Player[];
  round: number;
};

type ChatMessage = {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
};

// Roles that can see werewolf chat but not participate
const OBSERVER_ROLES = ["little-girl"];

export default function NightPhase({
  currentPlayer,
  players,
  round,
}: NightPhaseProps) {
  const theme = useTheme();
  const { toast } = useToast();
  const { getRoleBorderClass, getRoleColorClass, getRoleIcon, roleIcons } =
    useRoleStyles();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [actionTaken, setActionTaken] = useState(false);
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [revealedRole, setRevealedRole] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [werewolfMessages, setWerewolfMessages] = useState<ChatMessage[]>([
    {
      id: "w1",
      playerId: "system",
      playerName: "Game",
      message: "Werewolves, discuss who to attack tonight...",
      timestamp: new Date(),
    },
  ]);
  const [showChat, setShowChat] = useState(false);

  const alivePlayers = players.filter(
    (p) => p.isAlive && p.id !== currentPlayer.id,
  );
  const werewolfPlayers = players.filter(
    (p) => p.role === "werewolf" && p.isAlive,
  );

  const isWerewolf = currentPlayer.role === "werewolf";
  const canSeeWerewolfChat =
    isWerewolf || OBSERVER_ROLES.includes(currentPlayer.role);

  // Reset state when round changes
  useEffect(() => {
    setSelectedPlayer(null);
    setActionTaken(false);
    setShowRoleReveal(false);
    setRevealedRole(null);
  }, [round]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [werewolfMessages]);

  const handlePlayerSelect = (playerId: string) => {
    if (actionTaken) return;
    setSelectedPlayer(playerId);
  };

  const handleAction = () => {
    if (!selectedPlayer) return;

    // Different actions based on role
    if (currentPlayer.role === "werewolf") {
      toast({
        title: "Werewolf Action",
        description: `You have chosen to attack ${players.find((p) => p.id === selectedPlayer)?.name}`,
      });
    } else if (currentPlayer.role === "seer") {
      const targetPlayer = players.find((p) => p.id === selectedPlayer);
      if (targetPlayer) {
        setRevealedRole(targetPlayer.role);
        setShowRoleReveal(true);
      }
    } else if (currentPlayer.role === "witch") {
      toast({
        title: "Witch Action",
        description: `You have chosen to use a potion on ${players.find((p) => p.id === selectedPlayer)?.name}`,
      });
    }

    setActionTaken(true);
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !isWerewolf) return;

    const newMessage: ChatMessage = {
      id: `w${werewolfMessages.length + 1}`,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: message.trim(),
      timestamp: new Date(),
    };

    setWerewolfMessages([...werewolfMessages, newMessage]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderRoleSpecificUI = () => {
    switch (currentPlayer.role) {
      case "werewolf":
        return (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-red-400">Werewolf Night</h2>
            <p className="mt-2 text-gray-300">
              Choose a villager to attack tonight
            </p>
          </div>
        );
      case "seer":
        return (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-purple-400">Seer Vision</h2>
            <p className="mt-2 text-gray-300">
              Choose a player to reveal their role
            </p>
          </div>
        );
      case "witch":
        return (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-emerald-400">
              Witch's Brew
            </h2>
            <p className="mt-2 text-gray-300">
              Choose a player to use a potion on
            </p>
          </div>
        );
      default:
        return (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-400">Night Falls</h2>
            <p className="mt-2 text-gray-300">
              The village sleeps while others act...
            </p>
          </div>
        );
    }
  };

  // If player has no night action and can't see werewolf chat
  if (
    (currentPlayer.role === "villager" || currentPlayer.role === "hunter") &&
    !canSeeWerewolfChat
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <Moon className="mx-auto h-16 w-16 text-indigo-400 opacity-80" />
          <h2 className="mt-4 text-2xl font-bold text-white">
            Night Falls on the Village
          </h2>
          <p className="mt-2 text-gray-300">
            The village sleeps while the werewolves and special roles take their
            actions.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            You have no special night actions. Please wait for the night phase
            to end.
          </p>
        </motion.div>
      </div>
    );
  }

  // If player is an observer role (can see werewolf chat but not participate)
  if (OBSERVER_ROLES.includes(currentPlayer.role)) {
    return (
      <div className="flex h-full flex-col">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-purple-400">
            Special Ability
          </h2>
          <p className="mt-2 text-gray-300">
            You can secretly observe the werewolves' conversation
          </p>
        </div>

        <div className="relative flex flex-1 flex-col rounded-lg bg-black/30 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-red-900/50 px-4 py-2">
            <div className="flex items-center">
              <Eye className="mr-2 h-4 w-4 text-red-300" />
              <span className="text-sm font-medium text-red-300">
                Werewolf Chat (Observer Mode)
              </span>
            </div>
            <span className="rounded bg-red-800 px-2 py-0.5 text-xs text-white">
              Read Only
            </span>
          </div>

          <ScrollArea className="flex-1 p-4 pt-12" ref={scrollRef}>
            <div className="space-y-4">
              {werewolfMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3"
                >
                  {msg.playerId !== "system" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          players.find((p) => p.id === msg.playerId)?.avatar ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {msg.playerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.playerId === "system"
                        ? "bg-red-900/50 text-red-100"
                        : "bg-red-800/70 text-white"
                    }`}
                  >
                    {msg.playerId !== "system" && (
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {msg.playerName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <Input
                disabled
                placeholder="You can only observe the werewolf chat..."
                className="border-white/20 bg-black/30 text-white/50 placeholder:text-gray-500"
              />
              <Button disabled className="bg-red-900/50 text-white/50">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {renderRoleSpecificUI()}

      <AnimatePresence mode="wait">
        {showRoleReveal ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-1 flex-col items-center justify-center"
          >
            <div className="rounded-xl bg-black/40 p-6 text-center backdrop-blur-sm">
              <h3 className="text-xl font-medium text-white">
                You discovered a player's role!
              </h3>

              {revealedRole && (
                <div className="mt-4">
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${getRoleBorderClass(revealedRole)}`}
                  >
                    {getRoleIcon(revealedRole)}
                  </div>

                  <p
                    className={`mt-3 text-lg font-bold ${getRoleColorClass(revealedRole)}`}
                  >
                    {revealedRole.charAt(0).toUpperCase() +
                      revealedRole.slice(1)}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Use this information wisely during the day phase!
                  </p>
                </div>
              )}

              <Button
                className="mt-6 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowRoleReveal(false)}
              >
                Understood
              </Button>
            </div>
          </motion.div>
        ) : actionTaken ? (
          <motion.div
            key="action-taken"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center"
          >
            <div className="rounded-xl bg-black/40 p-6 text-center backdrop-blur-sm">
              <Check className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-3 text-xl font-medium text-white">
                Action Completed
              </h3>
              <p className="mt-2 text-gray-300">
                Your night action has been submitted. Waiting for other
                players...
              </p>

              {isWerewolf && (
                <Button
                  variant="outline"
                  className="mt-4 border-red-800/50 bg-red-900/30 text-white hover:bg-red-800/50"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {showChat ? "Hide Werewolf Chat" : "Show Werewolf Chat"}
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="player-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            {isWerewolf ? (
              <Tabs defaultValue="action" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="action">Select Target</TabsTrigger>
                  <TabsTrigger value="chat">Werewolf Chat</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="action"
                  className="h-[calc(100%-40px)] overflow-y-auto px-4"
                >
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {alivePlayers.map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: selectedPlayer === player.id ? 1.05 : 1,
                          boxShadow:
                            selectedPlayer === player.id
                              ? "0 0 0 2px rgba(255,255,255,0.5)"
                              : "none",
                        }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePlayerSelect(player.id)}
                        className={`cursor-pointer rounded-lg bg-black/30 p-4 text-center transition-all hover:bg-black/40 ${
                          selectedPlayer === player.id
                            ? "ring-2 ring-white/50"
                            : ""
                        }`}
                      >
                        <Avatar className="mx-auto h-16 w-16">
                          <AvatarImage
                            src={player.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-lg font-bold">
                            {player.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="mt-3 text-lg font-medium text-white">
                          {player.name}
                        </h3>

                        {player.role === "werewolf" && (
                          <p className="mt-1 text-xs font-medium text-red-400">
                            Fellow Werewolf
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="h-[calc(100%-40px)]">
                  <div className="flex h-full flex-col rounded-lg bg-black/30 backdrop-blur-sm">
                    <div className="bg-red-900/50 px-4 py-2">
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4 text-red-300" />
                        <span className="text-sm font-medium text-red-300">
                          Werewolf Chat
                        </span>
                      </div>
                      <p className="text-xs text-red-200/70">
                        Only werewolves can see and participate in this chat
                      </p>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                      <div className="space-y-4">
                        {werewolfMessages.map((msg, index) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex gap-3 ${msg.playerId === currentPlayer.id ? "flex-row-reverse" : ""}`}
                          >
                            {msg.playerId !== "system" && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    players.find((p) => p.id === msg.playerId)
                                      ?.avatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {msg.playerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                msg.playerId === "system"
                                  ? "bg-red-900/50 text-red-100"
                                  : msg.playerId === currentPlayer.id
                                    ? "bg-red-700/70 text-white"
                                    : "bg-red-800/70 text-white"
                              }`}
                            >
                              {msg.playerId !== "system" && (
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="text-xs font-medium">
                                    {msg.playerName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {msg.timestamp.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              )}
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="border-t border-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Coordinate with your pack..."
                          className="border-white/20 bg-black/30 text-white placeholder:text-gray-500 focus-visible:ring-red-500"
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send message</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full overflow-y-auto px-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {alivePlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: selectedPlayer === player.id ? 1.05 : 1,
                        boxShadow:
                          selectedPlayer === player.id
                            ? "0 0 0 2px rgba(255,255,255,0.5)"
                            : "none",
                      }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handlePlayerSelect(player.id)}
                      className={`cursor-pointer rounded-lg bg-black/30 p-4 text-center transition-all hover:bg-black/40 ${
                        selectedPlayer === player.id
                          ? "ring-2 ring-white/50"
                          : ""
                      }`}
                    >
                      <Avatar className="mx-auto h-16 w-16">
                        <AvatarImage
                          src={player.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-lg font-bold">
                          {player.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="mt-3 text-lg font-medium text-white">
                        {player.name}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!actionTaken && !showRoleReveal && (
        <div className="mt-auto flex items-center justify-between border-t border-white/10 p-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!selectedPlayer}
            className="border-white/20 bg-black/30 text-white hover:bg-white/10"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button
            onClick={handleAction}
            disabled={!selectedPlayer}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm Action
          </Button>
        </div>
      )}

      {actionTaken && isWerewolf && showChat && (
        <div className="mt-4 flex flex-1 flex-col rounded-lg bg-black/30 backdrop-blur-sm">
          <div className="bg-red-900/50 px-4 py-2">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-red-300" />
              <span className="text-sm font-medium text-red-300">
                Werewolf Chat
              </span>
            </div>
            <p className="text-xs text-red-200/70">
              Only werewolves can see and participate in this chat
            </p>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {werewolfMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${msg.playerId === currentPlayer.id ? "flex-row-reverse" : ""}`}
                >
                  {msg.playerId !== "system" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          players.find((p) => p.id === msg.playerId)?.avatar ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {msg.playerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.playerId === "system"
                        ? "bg-red-900/50 text-red-100"
                        : msg.playerId === currentPlayer.id
                          ? "bg-red-700/70 text-white"
                          : "bg-red-800/70 text-white"
                    }`}
                  >
                    {msg.playerId !== "system" && (
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {msg.playerName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Coordinate with your pack..."
                className="border-white/20 bg-black/30 text-white placeholder:text-gray-500 focus-visible:ring-red-500"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
