"use client";

import { ScrollArea } from "@/components/ui";
import { ROLES_DATA } from "@/data/roles";
import { useNotificationQueue } from "@/hooks/use-notification-queue";
import { NotificationIconConfigs } from "@/lib/theme/notification-icons";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConditionalChat } from "./components/conditional-chat";
import { GameHeader } from "./components/game-header";
import { GameStatusPanel } from "./components/game-status-panel";
import { NotificationQueue } from "./components/notification-queue";
import { PhaseTransition } from "./components/phase-transition";
import { PlayersGrid } from "./components/players-grid";
import { RoleActionModal } from "./components/role-action-modal";

// Types (same as before)
export type GamePhase = "role-reveal" | "night" | "day" | "voting" | "results";
export type PlayerRole =
  | "villager"
  | "werewolf"
  | "seer"
  | "doctor"
  | "hunter"
  | "witch"
  | "little-girl"
  | "cupid"
  | "lover";
export type PlayerStatus = "alive" | "dead";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role: PlayerRole;
  status: PlayerStatus;
  isCurrentPlayer?: boolean;
  votes?: number;
  isRevealed?: boolean;
}

export interface GameMessage {
  id: string;
  sender: string | null;
  content: string;
  timestamp: Date;
  isSystem: boolean;
  isPrivate: boolean;
  isWerewolfChat?: boolean;
  type?: "system" | "chat" | "action" | "elimination";
}

// Mock game data (same as before)
const mockGameData = {
  id: "game-abc123",
  name: "Village Mayhem",
  phase: "role-reveal" as GamePhase,
  day: 0,
  players: [
    {
      id: "p1",
      name: "WolfHunter",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "werewolf" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
    {
      id: "p2",
      name: "MoonHowler",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "werewolf" as PlayerRole,
      status: "alive" as PlayerStatus,
      isCurrentPlayer: true,
    },
    {
      id: "p3",
      name: "VillageElder",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "seer" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
    {
      id: "p4",
      name: "NightStalker",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "doctor" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
    {
      id: "p5",
      name: "ForestWanderer",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "villager" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
    {
      id: "p6",
      name: "MidnightHowl",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "werewolf" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
    {
      id: "p7",
      name: "SilentWatcher",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "hunter" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
    {
      id: "p8",
      name: "MoonChild",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "villager" as PlayerRole,
      status: "alive" as PlayerStatus,
    },
  ],
};

const PHASE_DURATIONS = {
  "role-reveal": 5,
  night: 10,
  day: 10,
  voting: 10,
  results: 10,
};

export default function GamePage() {
  const router = useRouter();
  const theme = useTheme();
  const { notifications, addNotification, removeNotification } =
    useNotificationQueue();

  // Game state
  const [gameData, setGameData] = useState(mockGameData);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("role-reveal");
  const [day, setDay] = useState(0);
  const [players, setPlayers] = useState<Player[]>(mockGameData.players);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [werewolfMessages, setWerewolfMessages] = useState<GameMessage[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(
    PHASE_DURATIONS["role-reveal"],
  );

  // UI state
  const [showRoleAction, setShowRoleAction] = useState(false);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [transitionType, setTransitionType] = useState<
    "day-to-night" | "night-to-day" | "elimination" | null
  >(null);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);

  // Memoized values to prevent unnecessary rerenders
  const currentPlayer = useMemo(
    () => players.find((p) => p.isCurrentPlayer),
    [players],
  );
  const currentPlayerRole = currentPlayer?.role;
  const roleConfig = useMemo(
    () =>
      currentPlayerRole
        ? ROLES_DATA.find((r) => r.id === currentPlayerRole)
        : null,
    [currentPlayerRole],
  );

  // Memoized chat type calculation
  const chatType = useMemo((): "village" | "werewolf" | "both" | "none" => {
    if (!currentPlayer || currentPlayer.status === "dead") return "none";

    switch (currentPhase) {
      case "night":
        if (roleConfig?.canSendWerewolfChat) return "werewolf";
        if (roleConfig?.canSeeWerewolfChat) return "werewolf";
        return "none";
      case "day":
      case "voting":
        if (roleConfig?.canSeeWerewolfChat) return "both";
        return "village";
      default:
        return "none";
    }
  }, [currentPlayer, currentPhase, roleConfig]);

  const handleSendMessage = useCallback(
    (message: string) => {
      const newMessage: GameMessage = {
        id: `m-chat-${Date.now()}`,
        sender: currentPlayer?.name || "Unknown",
        content: message,
        timestamp: new Date(),
        isSystem: false,
        isPrivate: false,
        type: "chat",
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    [currentPlayer?.name],
  );

  const handleSendWerewolfMessage = useCallback(
    (message: string) => {
      const newMessage: GameMessage = {
        id: `wm-chat-${Date.now()}`,
        sender: currentPlayer?.name || "Unknown",
        content: message,
        timestamp: new Date(),
        isSystem: false,
        isPrivate: true,
        isWerewolfChat: true,
        type: "chat",
      };
      setWerewolfMessages((prev) => [...prev, newMessage]);
    },
    [currentPlayer?.name],
  );

  // Phase timer effect
  useEffect(() => {
    if (phaseTimeRemaining <= 0) {
      handlePhaseTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setPhaseTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseTimeRemaining, currentPhase]);

  // Initialize phase
  useEffect(() => {
    if (currentPhase === "role-reveal") {
      const roleIconConfig = NotificationIconConfigs.roleReveal;
      addNotification({
        title: "Role Revealed",
        message: `You are a ${currentPlayer?.role}. ${roleConfig?.shortDescription || ""}`,
        type: "role",
        iconType: roleIconConfig.icon,
        iconClassName: roleIconConfig.className,
        duration: 8000,
      });

      setTimeout(() => {
        progressToNight();
      }, 5000);
    }
  }, [currentPhase, currentPlayer, roleConfig, addNotification]);

  const handlePhaseTimeUp = () => {
    switch (currentPhase) {
      case "night":
        progressToDay();
        break;
      case "day":
        progressToVoting();
        break;
      case "voting":
        handleVotingEnd();
        break;
      case "results":
        progressToNight();
        break;
    }
  };

  const progressToNight = () => {
    setTransitionType("day-to-night");
    setShowPhaseTransition(true);

    setTimeout(() => {
      setCurrentPhase("night");
      setPhaseTimeRemaining(PHASE_DURATIONS.night);
      setShowPhaseTransition(false);

      const nightIconConfig = NotificationIconConfigs.nightFalls;
      addNotification({
        title: "Night Falls",
        message:
          "The village sleeps. Werewolves and special roles may now act.",
        type: "phase",
        iconType: nightIconConfig.icon,
        iconClassName: nightIconConfig.className,
      });

      if (roleConfig?.actionTime === "night") {
        setTimeout(() => setShowRoleAction(true), 1000);
      }
    }, 1500);
  };

  const progressToDay = () => {
    setTransitionType("night-to-day");
    setShowPhaseTransition(true);

    setTimeout(() => {
      setDay((prev) => prev + 1);
      setCurrentPhase("day");
      setPhaseTimeRemaining(PHASE_DURATIONS.day);
      setShowPhaseTransition(false);

      const dayIconConfig = NotificationIconConfigs.dayBreaks;
      addNotification({
        title: `Day ${day + 1} Begins`,
        message:
          "The village awakens. Discuss and find the werewolves among you.",
        type: "phase",
        iconType: dayIconConfig.icon,
        iconClassName: dayIconConfig.className,
      });
    }, 1500);
  };

  const progressToVoting = () => {
    setCurrentPhase("voting");
    setPhaseTimeRemaining(PHASE_DURATIONS.voting);

    const votingIconConfig = NotificationIconConfigs.votingPhase;
    addNotification({
      title: "Voting Phase",
      message: "Time to vote! Select a player you suspect is a werewolf.",
      type: "warning",
      iconType: votingIconConfig.icon,
      iconClassName: votingIconConfig.className,
    });
  };

  const handleVotingEnd = () => {
    let maxVotes = 0;
    let eliminatedPlayerId = "";

    Object.entries(votes).forEach(([id, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        eliminatedPlayerId = id;
      }
    });

    if (eliminatedPlayerId) {
      const eliminatedPlayerData = players.find(
        (p) => p.id === eliminatedPlayerId,
      );
      if (eliminatedPlayerData) {
        setEliminatedPlayer(eliminatedPlayerData);
        setTransitionType("elimination");
        setShowPhaseTransition(true);

        const eliminationIconConfig = NotificationIconConfigs.elimination;
        addNotification({
          title: "Player Eliminated",
          message: `${eliminatedPlayerData.name} has been voted out! They were a ${eliminatedPlayerData.role}.`,
          type: "elimination",
          iconType: eliminationIconConfig.icon,
          iconClassName: eliminationIconConfig.className,
          duration: 8000,
        });

        setTimeout(() => {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === eliminatedPlayerId
                ? { ...p, status: "dead", isRevealed: true }
                : p,
            ),
          );
          setCurrentPhase("results");
          setPhaseTimeRemaining(PHASE_DURATIONS.results);
          setShowPhaseTransition(false);
          setVotes({});
        }, 3000);
      }
    } else {
      const noEliminationIconConfig = NotificationIconConfigs.noElimination;
      addNotification({
        title: "No Elimination",
        message: "The vote was tied. No one was eliminated this round.",
        type: "info",
        iconType: noEliminationIconConfig.icon,
        iconClassName: noEliminationIconConfig.className,
      });
      setCurrentPhase("results");
      setPhaseTimeRemaining(PHASE_DURATIONS.results);
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    if (currentPhase === "voting" && currentPlayer?.status === "alive") {
      setSelectedPlayer(playerId);
      setVotes((prev) => ({
        ...prev,
        [playerId]: (prev[playerId] || 0) + 1,
      }));

      const targetPlayer = players.find((p) => p.id === playerId);
      const voteCastIconConfig = NotificationIconConfigs.voteCast;
      addNotification({
        title: "Vote Cast",
        message: `You voted for ${targetPlayer?.name}`,
        type: "success",
        iconType: voteCastIconConfig.icon,
        iconClassName: voteCastIconConfig.className,
        duration: 3000,
      });
    }
  };

  const getPhaseBackground = () => {
    switch (currentPhase) {
      case "night":
        return "from-slate-900/60 via-indigo-950/80 to-slate-900/60 ";
      case "day":
        return "from-slate-900/60 via-amber-950/80 to-slate-900/60";
      case "voting":
        return "from-slate-900/60 via-red-950/80 to-slate-900/60";
      default:
        return "from-slate-900/60 to-slate-800/60 ";
    }
  };

  return (
    <div
      className={`transition-all duration-1000 ${transitionType === "night-to-day" ? theme.gameStyles.backgrounds.phases.day : theme.gameStyles.backgrounds.phases.night}`}
    >
      <ScrollArea
        className={`bg-gradient-to-b ${getPhaseBackground()} transition-all duration-1000 bg-cover bg-center bg-fixed max-h-screen`}
      >
        <GameHeader
          gameName={gameData.name}
          currentPhase={currentPhase}
          day={day}
          timeRemaining={phaseTimeRemaining}
          currentPlayer={currentPlayer}
          onLeaveGame={() => router.push("/dashboard")}
        />

        <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
          <div
            className={`grid gap-6 h-full ${chatType !== "none" ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"}`}
          >
            <div
              className={`space-y-6 ${chatType !== "none" ? "lg:col-span-3" : "col-span-1"}`}
            >
              <PlayersGrid
                players={players}
                currentPlayer={currentPlayer}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={handlePlayerSelect}
                currentPhase={currentPhase}
                votes={votes}
                canInteract={
                  currentPhase === "voting" && currentPlayer?.status === "alive"
                }
              />

              <GameStatusPanel
                currentPhase={currentPhase}
                day={day}
                roleConfig={roleConfig}
                currentPlayer={currentPlayer}
              />
            </div>

            {chatType !== "none" && (
              <div className="lg:col-span-1">
                <ConditionalChat
                  messages={messages}
                  werewolfMessages={werewolfMessages}
                  onSendMessage={handleSendMessage}
                  onSendWerewolfMessage={handleSendWerewolfMessage}
                  chatType={chatType}
                  currentPhase={currentPhase}
                  currentPlayer={currentPlayer}
                  roleConfig={roleConfig}
                />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Notification Queue */}
        <NotificationQueue
          notifications={notifications}
          onDismiss={removeNotification}
          maxVisible={3}
        />

        {/* Modals and Overlays */}
        <AnimatePresence>
          {showPhaseTransition && (
            <PhaseTransition
              type={transitionType}
              eliminatedPlayer={eliminatedPlayer}
              onComplete={() => setShowPhaseTransition(false)}
            />
          )}

          {showRoleAction && currentPlayer && (
            <RoleActionModal
              role={currentPlayer.role}
              players={players.filter(
                (p) => p.status === "alive" && !p.isCurrentPlayer,
              )}
              onComplete={(result) => {
                setShowRoleAction(false);
                const actionIconConfig = NotificationIconConfigs.actionComplete;
                addNotification({
                  title: "Action Complete",
                  message: "Your night action has been completed.",
                  type: "success",
                  iconType: actionIconConfig.icon,
                  iconClassName: actionIconConfig.className,
                });
              }}
            />
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
