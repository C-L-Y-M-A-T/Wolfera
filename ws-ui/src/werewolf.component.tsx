import React from "react";
import { Socket } from "socket.io-client";
import showToast from "./showToast";
import { Player } from "./types";

type PlayerActionPayload = {
  activePhase: string;
  timestamp: number;
  phasePayload: {
    action: string;
    targetId: string;
  };
};

export interface WerewolfVote {
  voterId: string;
  targetId: string;
  timestamp: number;
}

type WerewolfPhaseProps = {
  gameData: {
    players: Player[];
  };
  user: {
    id: string;
  };
  votes: WerewolfVote[];
  setVotes: (votes: WerewolfVote[]) => void;
  socket: Socket | null;
  sectionStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
};

const WerewolfPhase: React.FC<WerewolfPhaseProps> = ({
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
  /*
  useEffect(() => {
    console.log("226 sockket: ", socket);
    if (socket) {
      // Listen for vote updates from the server
      socket.on("game:werewolf:vote", (votes: WerewolfVote[]) => {
        setVotes(votes);
        console.log("225 votes: ", votes);
      });

      // Cleanup listener on unmount
      return () => {
        //socket.off("game:werewolf:vote");
      };
    }
  }, [socket]);*/

  const currentPlayer = gameData.players.find((p) => p.id === user.id);
  const handleVote = (targetId: string, action: string = "vote") => {
    setSelectedTargetId(targetId);
    if (socket) {
      const payload: PlayerActionPayload = {
        activePhase: "Werewolf-phase",
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

  if (currentPlayer?.role === "Werewolf") {
    const targets = gameData.players.filter(
      (p) => p.isAlive && p.role !== "Werewolf",
    );
    return (
      <div style={sectionStyle}>
        <h3>🐺 Werewolf Phase</h3>
        <p>Select a player to eliminate, or vote for no elimination:</p>
        <ul>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {targets.map((p) => {
                const votesForPlayer = votes.filter((v) => v.targetId === p.id);
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        style={{
                          ...buttonStyle,
                          backgroundColor:
                            selectedTargetId === p.id ? "#d32f2f" : "#5eff4f",
                          color:
                            selectedTargetId === p.id
                              ? "#fff"
                              : buttonStyle?.color,
                        }}
                        onClick={() => handleVote(p.id, "vote")}
                      >
                        {p.username || p.id} {selectedTargetId === p.id && "✓"}
                      </button>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {votesForPlayer.length > 0
                        ? `Votes: ${votesForPlayer
                            .map((v) => {
                              const voter = gameData.players.find(
                                (pl) => pl.id === v.voterId,
                              );
                              return voter?.username || v.voterId;
                            })
                            .join(", ")}`
                        : "Votes: 0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <li style={{ marginBottom: "0.5rem" }}>
            <button
              style={{
                ...buttonStyle,
                backgroundColor:
                  selectedTargetId === "none" ? "#19761d2" : "#c0ff84",
                color:
                  selectedTargetId === "none" ? "#fff" : buttonStyle?.color,
              }}
              onClick={() => {
                setSelectedTargetId("none");
                if (socket) {
                  const payload: PlayerActionPayload = {
                    activePhase: "Werewolf-phase",
                    timestamp: Date.now(),
                    phasePayload: {
                      action: "skip",
                      targetId: "none",
                    },
                  };
                  socket.emit("player-action", payload);
                  showToast("Voted for no elimination", "info");
                }
              }}
            >
              No elimination {selectedTargetId === "none" && "✓"}
            </button>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div style={sectionStyle}>
        <h3>🐺 Werewolf Phase</h3>
        <p>Waiting for werewolves to act...</p>
      </div>
    );
  }
};

export default WerewolfPhase;
