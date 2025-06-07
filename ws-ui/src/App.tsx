import axios from "axios";
import { JSX, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socket } from "socket.io-client";
import { BACKEND_URL, connectToGameSocket } from "./api";
import DayVotingPhase from "./day-voting.component";
import GameContextComponent, {
  ActivePhaseComponent,
} from "./gameContext.component";
import { GameOverPopup } from "./gameOverPopup";
import showToast from "./showToast";
import {
  CreateGameResponse,
  GameData,
  GameOptions,
  JoinedEvent,
  Phase,
  Player,
  PlayerActionPayload,
  RoleAssignedEvent,
  RoleRevealvent,
  User,
  WsException,
} from "./types";
import WerewolfPhase, { WerewolfVote } from "./werewolf.component";

const containerStyle: React.CSSProperties = {
  padding: "1.5rem",
  fontFamily: "Arial, sans-serif",
  background: "#f8f9fa",
  borderRadius: "12px",
  maxWidth: "600px",
  margin: "2rem auto",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1.5rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  marginBottom: "0.5rem",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  padding: "0.4rem 0.7rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginBottom: "0.7rem",
  width: "100%",
  fontSize: "1rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1.2rem",
  borderRadius: "5px",
  border: "none",
  background: "#4f8cff",
  color: "#fff",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "0.5rem",
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#b0c4de",
  cursor: "not-allowed",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e0e0e0",
  margin: "1.5rem 0",
};
export const tempGameOptions: GameOptions = {
  roles: {
    Werewolf: 1,
  },
  totalPlayers: 3,
};

export default function WerewolfGame(): JSX.Element {
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
  });
  const [gameId, setGameId] = useState<string>("");
  const [gameOptions, setGameOptions] = useState<GameOptions>(tempGameOptions);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [role, setRole] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [creatorGameId, setCreatorGameId] = useState<string>("");
  const [joinedMessages, setJoinedMessages] = useState<string[]>([]);
  const [activePhase, setActivePhase] = useState<Phase | null>(null);
  const [werewolfesVotes, setwerewolfesVotes] = useState<WerewolfVote[]>([]);
  const [dayVotes, setDayVotes] = useState<WerewolfVote[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  const getGameData = () => gameData;
  const handleCreateGame = async (): Promise<void> => {
    try {
      const res = await axios.post<CreateGameResponse>(
        `${BACKEND_URL}/game/create`,
        {
          userId: "f2ea15fe-1a77-4a50-b984-439741cf85b9",
          username: "salah",
          gameOptions: {
            ...gameOptions,
            roles: {
              ...gameOptions.roles,
              Villager:
                gameOptions.totalPlayers -
                Object.values(gameOptions.roles).reduce(
                  (sum, val) => sum + val,
                  0,
                ),
            },
          },
        },
      );
      setUser({
        id: "f2ea15fe-1a77-4a50-b984-439741cf85b9",
        username: "salah",
      });
      setCreatorGameId(res.data.gameId);
      setGameId(res.data.gameId);
    } catch (error) {
      console.error("Error creating game:", error);
      showToast("Failed to create game", "error");
    }
  };

  const setPlayerRole = (playerId: string, role: string): void => {
    setGameData((prevGameData) => {
      const player = prevGameData?.players?.find((p) => p.id === playerId);
      console.log("Setting role for player:", player, "Role:", role);
      console.log("Game data before setting role:", prevGameData);
      if (prevGameData && player) {
        player.role = role;
        return { ...prevGameData };
      } else {
        console.error(`Player with ID ${playerId} not found in game data`);
        showToast(`Player with ID ${playerId} not found`, "error");
        return prevGameData;
      }
    });
  };

  const handleJoinGame = (): void => {
    const sock: Socket = connectToGameSocket(user, gameId);

    sock.on("exception", (err: WsException) => {
      console.error("WsException received:", err);
      showToast(err.message || "An error occurred", "error");
    });

    sock.on("connect", () => {
      //sock.emit("join_game", { userId, gameId });
    });

    sock.on("player-join", (payload: JoinedEvent) => {
      setGameData((prevGameData) => {
        if (!prevGameData) return null;
        const newPlayer: Player = payload;
        setJoinedMessages((prev: string[]) => [
          ...prev,
          `${payload.username} joined the game`,
        ]);
        showToast(`${payload.username} joined the game`, "success");
        // Add the new player to the players array
        return {
          ...prevGameData,
          players: [...(prevGameData.players || []), newPlayer],
        };
      });
    });

    sock.on("game-start", (data: GameData) => {
      console.log("888 Game data received:", data);
      console.log("Game started:", data);
      setGameData(data);
    });

    sock.on("role-assigned", ({ role }: RoleAssignedEvent) => {
      console.log(`Player ${user.id} assigned role: ${role}`);
      setPlayerRole(user.id, role);
      setRole(role);
    });

    sock.on("phase-start", (phase: Phase) => {
      setActivePhase(phase);
      console.log("Phase started: ", phase);
    });

    sock.on("role-revealed", ({ playerId, role }: RoleRevealvent) => {
      console.log(`Role revealed for player ${playerId}: ${role}`);
      setPlayerRole(playerId, role);
    });

    sock.on("werewolf-vote", (votes: WerewolfVote[]) => {
      setwerewolfesVotes(votes);
      console.log("225 votes: ", votes);
    });

    sock.on("game-ended", (data: any) => {
      console.log("Game ended:", data);
      setGameOverMessage(data.message);
      setGameData(null);
      setActivePhase(null);
      setRole("");
      setwerewolfesVotes([]);
    });

    sock.on("game-data", (data: GameData) => {
      console.log("Game data received:", data);
      setGameData(data);
    });

    sock.on("player-connect", (player: Player) => {
      console.log(`Player connected: ${player.username} (${player.id})`);
      setGameData((prevGameData) => {
        if (!prevGameData) return null;
        const existingIndex = (prevGameData.players || []).findIndex(
          (p) => p.id === player.id,
        );
        let updatedPlayers;
        if (existingIndex !== -1) {
          // Replace the existing player
          updatedPlayers = [...prevGameData.players];
          updatedPlayers[existingIndex] = player;
        } else {
          // Add the new player
          updatedPlayers = [...(prevGameData.players || []), player];
        }
        return {
          ...prevGameData,
          players: updatedPlayers,
        };
      });
    });

    sock.on("player-disconnect", (player: Player) => {
      console.log(`Player disconnected: ${player.username} (${player.id})`);
      setGameData((prevGameData) => {
        if (!prevGameData) return null;
        // Add the newly connected player to the players array
        return {
          ...prevGameData,
          players: [...(prevGameData.players || []), player],
        };
      });
    });

    sock.on("round-results", (result: any) => {
      //TODO:send eliminated players roles with the result
      debugger;
      setGameData((prevGameData) => {
        if (!prevGameData) return null;

        const eliminatedPlayers = result.eliminatedPlayers.map(
          (eliminatedId: string) =>
            prevGameData.players?.find((p) => p.id === eliminatedId),
        );

        // Create a new copy of the game data with updated players
        const updatedPlayers = prevGameData.players.map((player) => {
          if (result.eliminatedPlayers.includes(player.id)) {
            return { ...player, isAlive: false };
          }
          return player;
        });

        showToast(
          result.message +
            `\n eliminated player ${eliminatedPlayers.map((p: Player) => p.username).join(", ")}`,
          "info",
        );

        return { ...prevGameData, players: updatedPlayers };
      });
    });
    sock.on("channel-status", (status: any) => {
      console.log("Channel status update:", status);
      showToast(`Channel ${status.channelId} status: ${status.status}`, "info");
    });
    sock.on("chat-message", (message: any) => {
      console.log("Chat message received:", message);
      showToast(
        `New message in ${message.channel}: ${message.content}`,
        "info",
      );
    });

    setSocket(sock);
  };

  const handleStartGame = (): void => {
    if (socket) {
      const payload: PlayerActionPayload = {
        activePhase: "WaitingForGameStart-phase",
        timestamp: Date.now(),
        phasePayload: {
          action: "start-game",
        },
      };
      socket.emit("player-action", payload);
    }
  };

  return (
    <>
      <ToastContainer />
      {gameData && (
        <GameContextComponent
          gameData={gameData}
          currentUser={user}
          role={role}
          phase={activePhase?.phaseName || ""}
        />
      )}
      {gameOverMessage && (
        <GameOverPopup
          message={gameOverMessage}
          onClose={() => setGameOverMessage(null)}
        />
      )}
      {activePhase && <ActivePhaseComponent {...activePhase} />}
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          🐺 Werewolf Game
        </h2>
        {/* Create game (userId = "f2ea15fe-1a77-4a50-b984-439741cf85b9") */}
        <div style={sectionStyle}>
          <button style={buttonStyle} onClick={handleCreateGame}>
            Create Game (as salah)
          </button>
          <div style={{ marginTop: "1rem" }}>
            <label style={labelStyle}>
              Number of Werewolves:
              <input
                type="number"
                min={1}
                max={gameOptions.totalPlayers - 1}
                style={inputStyle}
                value={gameOptions.roles.Werewolf}
                onChange={(e) => {
                  const werewolfCount = Math.max(
                    1,
                    Math.min(
                      Number(e.target.value),
                      gameOptions.totalPlayers - 1,
                    ),
                  );
                  setGameOptions((prev) => ({
                    ...prev,
                    roles: { ...prev.roles, Werewolf: werewolfCount },
                  }));
                }}
              />
            </label>
            <label style={labelStyle}>
              Number of Players:
              <input
                type="number"
                min={2}
                max={20}
                style={inputStyle}
                value={gameOptions.totalPlayers}
                onChange={(e) => {
                  const total = Math.max(
                    3,
                    Math.min(Number(e.target.value), 20),
                  );
                  setGameOptions((prev) => ({
                    ...prev,
                    totalPlayers: total,
                    roles: {
                      ...prev.roles,
                      Werewolf: Math.min(prev.roles.Werewolf, total - 1),
                    },
                  }));
                }}
              />
            </label>
          </div>
          {creatorGameId && (
            <p style={{ marginTop: "0.7rem" }}>
              Created Game ID:{" "}
              <strong
                style={{
                  color: "#4f8cff",
                  cursor: "pointer",
                  userSelect: "all",
                }}
                title="Click to copy"
                onClick={() => {
                  navigator.clipboard.writeText(creatorGameId);
                  showToast("Game ID copied!", "success");
                }}
              >
                {creatorGameId}
              </strong>
            </p>
          )}
        </div>
        <hr style={hrStyle} />
        {/* Join game */}
        <div style={sectionStyle}>
          <label style={labelStyle}>
            User ID:
            <input
              style={inputStyle}
              value={user.id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, id: e.target.value })
              }
              placeholder="Enter your user ID"
            />
          </label>
          <label style={labelStyle}>
            Username:
            <input
              style={inputStyle}
              value={user.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, username: e.target.value })
              }
              placeholder="Enter your username"
            />
          </label>
          <label style={labelStyle}>
            Game ID:
            <input
              style={inputStyle}
              value={gameId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGameId(e.target.value)
              }
              placeholder="Enter game ID"
            />
          </label>
          <button
            style={!user || !gameId ? disabledButtonStyle : buttonStyle}
            onClick={handleJoinGame}
            disabled={!user || !gameId}
          >
            Join Game
          </button>
        </div>
        <hr style={hrStyle} />
        {/* In-game view */}
        {socket && (
          <div style={sectionStyle}>
            <p>
              Connected as{" "}
              <strong style={{ color: "#4f8cff" }}>{user.username}</strong> in
              game <strong style={{ color: "#4f8cff" }}>{gameId}</strong>
            </p>
            {user.id === "f2ea15fe-1a77-4a50-b984-439741cf85b9" && (
              <button style={buttonStyle} onClick={handleStartGame}>
                🚀 Start Game
              </button>
            )}

            <h4 style={{ marginTop: "1.2rem" }}>🧍 Players Joining:</h4>
            <ul style={{ marginLeft: "1.2rem" }}>
              {joinedMessages.map((msg: string, idx: number) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
            {gameData && (
              <div>
                <h3>🎮 Game Data:</h3>
                <pre
                  style={{
                    background: "#f4f4f4",
                    padding: "0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                  }}
                >
                  {JSON.stringify(gameData, null, 2)}
                </pre>
              </div>
            )}
            {activePhase && (
              <div>
                <h3>📝 Active Phase JSON:</h3>
                <pre
                  style={{
                    background: "#f4f4f4",
                    padding: "0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                  }}
                >
                  {JSON.stringify(activePhase, null, 2)}
                </pre>
              </div>
            )}

            {/* Display role if assigned */}
            <h3 style={{ marginTop: "1.5rem" }}>🔍 Role Assignment</h3>
            {role && (
              <div>
                <h3>
                  🧙 Your Role:{" "}
                  <span style={{ color: "green", fontWeight: 700 }}>
                    {role}
                  </span>
                </h3>
              </div>
            )}
          </div>
        )}
        {gameData && activePhase?.phaseName === "Werewolf-phase" && (
          <WerewolfPhase
            gameData={gameData}
            user={user}
            socket={socket}
            votes={werewolfesVotes}
            setVotes={setwerewolfesVotes}
            sectionStyle={sectionStyle}
            buttonStyle={buttonStyle}
          ></WerewolfPhase>
        )}
        {gameData && activePhase?.phaseName === "Voting-phase" && (
          <DayVotingPhase
            gameData={gameData}
            user={user}
            socket={socket}
            votes={dayVotes}
            setVotes={setDayVotes}
            sectionStyle={sectionStyle}
          />
        )}
      </div>
    </>
  );
}
