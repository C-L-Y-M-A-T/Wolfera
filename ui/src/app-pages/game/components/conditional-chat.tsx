"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Send, Skull, Users } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { GameMessage, GamePhase, Player } from "../game-page";

interface ConditionalChatProps {
  messages: GameMessage[];
  werewolfMessages: GameMessage[];
  onSendMessage: (message: string) => void;
  onSendWerewolfMessage: (message: string) => void;
  chatType: "village" | "werewolf" | "both" | "none";
  currentPhase: GamePhase;
  currentPlayer?: Player;
  roleConfig?: any;
}

// Memoized message component to prevent unnecessary rerenders
const MessageItem = memo(
  ({
    message,
    isWerewolf = false,
  }: {
    message: GameMessage;
    isWerewolf?: boolean;
  }) => {
    const getMessageStyle = () => {
      if (message.isSystem) {
        return isWerewolf
          ? "bg-red-950/50 border-red-800/50"
          : "bg-slate-800/80 border-slate-600";
      }
      if (message.isWerewolfChat) {
        return "bg-red-900/30 border-red-800/50";
      }
      return isWerewolf
        ? "bg-red-900/20 border-red-800/30"
        : "bg-slate-700/80 border-slate-600";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`p-3 rounded-lg border ${getMessageStyle()} backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Image
            src={isWerewolf ? "/werewolf.svg" : "/villager.svg"}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          {message.sender ? (
            <span
              className={`font-medium text-sm ${isWerewolf ? "text-red-300" : "text-blue-300"}`}
            >
              {message.sender}
            </span>
          ) : (
            <span
              className={`text-xs uppercase tracking-wide ${isWerewolf ? "text-red-400" : "text-slate-400"}`}
            >
              {isWerewolf ? "Pack Leader" : "System"}
            </span>
          )}
          <span
            className={`text-xs ml-auto ${isWerewolf ? "text-red-500" : "text-slate-500"}`}
          >
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <p
          className={`text-sm leading-relaxed ${isWerewolf ? "text-red-100" : "text-white"}`}
        >
          {message.content}
        </p>
      </motion.div>
    );
  },
);

MessageItem.displayName = "MessageItem";

// Simplified chat input component
const ChatInput = memo(
  ({
    onSend,
    placeholder,
    disabled,
    isWerewolf = false,
    helpText,
  }: {
    onSend: (message: string) => void;
    placeholder: string;
    disabled: boolean;
    isWerewolf?: boolean;
    helpText?: string;
  }) => {
    const [value, setValue] = useState("");

    const handleSend = useCallback(() => {
      if (!value.trim() || disabled) return;
      onSend(value);
      setValue(""); // Clear input after sending
    }, [value, disabled, onSend]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !disabled) {
          handleSend();
        }
      },
      [handleSend, disabled],
    );

    return (
      <div
        className={`p-4 border-t ${isWerewolf ? "border-red-800/50 bg-red-950/20" : "border-slate-700 bg-slate-800/30"}`}
      >
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={
              isWerewolf
                ? "bg-red-900/30 border-red-800/50 text-red-100 placeholder:text-red-400/70"
                : "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
            }
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            size="sm"
            className={`min-w-[60px] ${isWerewolf ? "bg-red-700 hover:bg-red-800" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {helpText && (
          <p
            className={`text-xs mt-2 ${isWerewolf ? "text-red-500/70" : "text-slate-500"}`}
          >
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";

export const ConditionalChat = memo(function ConditionalChat({
  messages,
  werewolfMessages,
  onSendMessage,
  onSendWerewolfMessage,
  chatType,
  currentPhase,
  currentPlayer,
  roleConfig,
}: ConditionalChatProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(
    chatType === "werewolf" ? "werewolf" : "village",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const werewolfMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom (only when messages change, not on timer updates)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    werewolfMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [werewolfMessages.length]);

  // Auto-switch to appropriate tab based on phase (only when phase changes)
  useEffect(() => {
    if (currentPhase === "night" && roleConfig?.canSendWerewolfChat) {
      setActiveTab("werewolf");
    } else if (currentPhase === "day" || currentPhase === "voting") {
      setActiveTab("village");
    }
  }, [currentPhase, roleConfig?.canSendWerewolfChat]);

  // Memoized phase description
  const phaseDescription = useCallback(() => {
    switch (currentPhase) {
      case "night":
        if (roleConfig?.canSendWerewolfChat) {
          return "Coordinate with your pack";
        }
        if (roleConfig?.canSeeWerewolfChat) {
          return "Observe the werewolves";
        }
        return "Night phase - limited communication";
      case "day":
        return "Discuss and find the werewolves";
      case "voting":
        return "Final discussions before voting";
      default:
        return "Chat available";
    }
  }, [currentPhase, roleConfig]);

  // Memoized chat title
  const chatTitle = useCallback(() => {
    switch (currentPhase) {
      case "night":
        return roleConfig?.canSendWerewolfChat
          ? "Pack Coordination"
          : "Night Watch";
      case "day":
        return "Village Discussion";
      case "voting":
        return "Voting Discussion";
      default:
        return "Game Chat";
    }
  }, [currentPhase, roleConfig]);

  const VillageChatContent = memo(() => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-2 p-4 border-b border-slate-700 bg-slate-800/50">
        <Users className="h-5 w-5 text-blue-400" />
        <div className="flex-1">
          <h3 className="font-semibold text-white">{chatTitle()}</h3>
          <p className="text-xs text-slate-400">{phaseDescription()}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          <span className="capitalize">{currentPhase}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.slice(-20).map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        onSend={onSendMessage}
        placeholder="Share your thoughts..."
        disabled={false}
      />
    </motion.div>
  ));

  VillageChatContent.displayName = "VillageChatContent";

  const WerewolfChatContent = memo(() => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-2 p-4 border-b border-red-800/50 bg-red-950/30">
        <Skull className="h-5 w-5 text-red-400" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-300">Werewolf Pack</h3>
          <p className="text-xs text-red-400">
            {roleConfig?.canSendWerewolfChat
              ? "Active Member"
              : "Silent Observer"}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-red-500">
          <Clock className="h-3 w-3" />
          <span>Night</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-red-950/10">
        <div className="space-y-3">
          <AnimatePresence>
            {werewolfMessages.slice(-20).map((message) => (
              <MessageItem key={message.id} message={message} isWerewolf />
            ))}
          </AnimatePresence>
          <div ref={werewolfMessagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        onSend={onSendWerewolfMessage}
        placeholder={
          roleConfig?.canSendWerewolfChat
            ? "Coordinate with your pack..."
            : "Observer mode - read only"
        }
        disabled={!roleConfig?.canSendWerewolfChat}
        isWerewolf
        helpText={
          !roleConfig?.canSendWerewolfChat && roleConfig?.canSeeWerewolfChat
            ? "You can observe but cannot participate in werewolf chat"
            : undefined
        }
      />
    </motion.div>
  ));

  WerewolfChatContent.displayName = "WerewolfChatContent";

  if (chatType === "both") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${theme.gameStyles.cards.default} h-full flex flex-col overflow-hidden`}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 m-2">
            <TabsTrigger
              value="village"
              className="data-[state=active]:bg-slate-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Village
            </TabsTrigger>
            <TabsTrigger
              value="werewolf"
              className="data-[state=active]:bg-red-900/50 data-[state=active]:text-red-300"
            >
              <Skull className="h-4 w-4 mr-2" />
              Pack
            </TabsTrigger>
          </TabsList>

          <TabsContent value="village" className="flex-1 m-0">
            <VillageChatContent />
          </TabsContent>

          <TabsContent value="werewolf" className="flex-1 m-0">
            <WerewolfChatContent />
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  }

  if (chatType === "werewolf") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${theme.gameStyles.cards.default} h-full overflow-hidden`}
      >
        <WerewolfChatContent />
      </motion.div>
    );
  }

  if (chatType === "village") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${theme.gameStyles.cards.default} h-full overflow-hidden`}
      >
        <VillageChatContent />
      </motion.div>
    );
  }

  return null;
});
