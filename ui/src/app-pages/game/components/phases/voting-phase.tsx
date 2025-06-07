"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Player } from "@/providers/game-provider";
import { useTheme } from "@/providers/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Send, UserX } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type VotingPhaseProps = {
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

export default function VotingPhase({
  currentPlayer,
  players,
  round,
}: VotingPhaseProps) {
  const theme = useTheme();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "v1",
      playerId: "system",
      playerName: "Game",
      message: "Voting phase has begun. Choose who to eliminate!",
      timestamp: new Date(),
    },
    {
      id: "v2",
      playerId: "2",
      playerName: "Player 2",
      message:
        "I think Player 5 is suspicious. They were quiet during the day.",
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: "v3",
      playerId: "5",
      playerName: "Player 5",
      message: "I'm not a werewolf! I was just thinking about the clues.",
      timestamp: new Date(Date.now() - 15000),
    },
  ]);

  const alivePlayers = players.filter(
    (p) => p.isAlive && p.id !== currentPlayer.id,
  );

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayerSelect = (playerId: string) => {
    if (hasVoted) return;
    setSelectedPlayer(playerId);
  };

  const handleVote = () => {
    if (!selectedPlayer || hasVoted) return;

    toast({
      title: "Vote Submitted",
      description: `You voted to eliminate ${players.find((p) => p.id === selectedPlayer)?.name}`,
    });

    setHasVoted(true);

    // Add system message about the vote
    const newMessage: ChatMessage = {
      id: `v${chatMessages.length + 1}`,
      playerId: "system",
      playerName: "Game",
      message: `${currentPlayer.name} has voted.`,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: `v${chatMessages.length + 1}`,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: message.trim(),
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UserX className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-2 text-2xl font-bold text-white">Village Vote</h2>
          <p className="mt-1 text-gray-300">
            Choose who to eliminate from the village
          </p>

          <div className="mx-auto mt-3 flex max-w-xs items-center gap-2">
            <Progress
              value={(timeRemaining / 120) * 100}
              className="h-2 bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-300">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Discussion</TabsTrigger>
          <TabsTrigger value="vote">Vote</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="h-[calc(100%-40px)]">
          <div className="flex h-full flex-col rounded-lg bg-black/30 backdrop-blur-sm">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
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
                          ? "bg-rose-900/50 text-rose-100"
                          : msg.playerId === currentPlayer.id
                            ? "bg-purple-700/70 text-white"
                            : "bg-gray-800/70 text-white"
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
                  placeholder="Make your case..."
                  className="border-white/20 bg-black/30 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vote" className="h-[calc(100%-40px)]">
          <AnimatePresence mode="wait">
            {hasVoted ? (
              <motion.div
                key="voted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center"
              >
                <div className="rounded-xl bg-black/40 p-6 text-center backdrop-blur-sm">
                  <Check className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-3 text-xl font-medium text-white">
                    Vote Submitted
                  </h3>
                  <p className="mt-2 text-gray-300">
                    You voted for{" "}
                    {players.find((p) => p.id === selectedPlayer)?.name}
                  </p>
                  <p className="mt-4 text-sm text-gray-400">
                    Waiting for all players to vote or the timer to end...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="voting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto px-4"
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

                      {/* Optional: Show role if player is dead and revealed */}
                      {!player.isAlive && player.isRevealed && (
                        <p className="mt-1 text-xs font-medium text-gray-400">
                          {player.role.charAt(0).toUpperCase() +
                            player.role.slice(1)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <Button
                    onClick={handleVote}
                    disabled={!selectedPlayer}
                    className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-2 text-white hover:from-rose-700 hover:to-red-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Vote
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
