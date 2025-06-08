import React from "react";
import { Socket } from "socket.io-client";
import showToast from "./showToast";
import { Player } from "./types";

const ACTIVE_PHASE = "Voting-phase";

type PlayerActionPayload = {
  activePhase: string;
  timestamp: number;
  phasePayload: {
    action: string;
    targetId: string;
  };
};

export interface PlayerVote {
  voterId: string;
  targetId: string;
  timestamp: number;
}

type DayVotingPhaseProps = {
  gameData: {
    players: Player[];
  };
  user: {
    id: string;
  };
  votes: PlayerVote[];
  setVotes: (votes: PlayerVote[]) => void;
  socket: Socket | null;
  sectionStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
};

const DayVotingPhase: React.FC<DayVotingPhaseProps> = ({
  gameData,
  user,
  socket,
  votes,
  setVotes,
  sectionStyle = {},
  buttonStyle = {},
}) => {
  const [selectedTargetId, setSelectedTargetId] = React.useState<string | null>(
    null,
  );
  const handleVote = (targetId: string, action: string = "vote") => {
    setSelectedTargetId(targetId);
    if (socket) {
      const payload: PlayerActionPayload = {
        activePhase: ACTIVE_PHASE,
        timestamp: Date.now(),
        phasePayload: {
          action,
          targetId,
        },
      };
      socket.emit("player-action", payload);
      if (targetId === "none") {
        showToast("Voted for no elimination", "info");
      } else {
        const targetPlayer = gameData.players.find((p) => p.id === targetId);
        showToast(
          `Voted to eliminate ${targetPlayer?.username || targetId}`,
          "info",
        );
      }
    }
  };
  const targets = [
    ...gameData.players.filter((p) => p.isAlive),
    {
      id: "none",
      username: "No elimination",
      isAlive: true,
    } as Player,
  ];

  return (
    <div style={{ ...sectionStyle, textAlign: "center" }}>
      <h3>🫵🏼 Voting Phase</h3>
      <p>Select a player to eliminate, or vote for no elimination:</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {targets.map((p) => {
          const votesForPlayer = votes.filter((v) => v.targetId === p.id);
          const isSelected = selectedTargetId === p.id;
          const isNoElimination = p.id === "none";

          return (
            <div
              key={p.id}
              onClick={() =>
                handleVote(p.id, isNoElimination ? "skip" : "vote")
              }
              style={{
                padding: "1rem",
                borderRadius: "10px",
                backgroundColor: isSelected
                  ? isNoElimination
                    ? "#ffebc2"
                    : "#f28b82"
                  : isNoElimination
                    ? "#e6f4ea"
                    : "#a7f3d0",
                color: isSelected ? "#000" : "#111",
                cursor: "pointer",
                border: isSelected ? "2px solid #000" : "1px solid #ccc",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {p.username}
                {isSelected && " ✓"}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                  color: "#555",
                }}
              >
                <strong>Voted by:</strong>{" "}
                {votesForPlayer.length > 0
                  ? votesForPlayer
                      .map(
                        (v) =>
                          gameData.players.find((pl) => pl.id === v.voterId)
                            ?.username || v.voterId,
                      )
                      .join(", ")
                  : "No votes"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayVotingPhase;
