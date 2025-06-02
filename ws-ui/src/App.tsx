import axios from "axios";
import { JSX, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socket } from "socket.io-client";
import { BACKEND_URL, connectToGameSocket } from "./api";
import showToast from "./showToast";

// Type definitions
interface GameData {
  gameId: string;
  players: string[];
  phase: string;
  [key: string]: any; // Allow for additional properties
}

interface PlayerActionPayload {
  activePhase: string;
  timestamp: number;
  phasePayload: {
    action?: string;
    targetId?: string;
    [key: string]: any;
  };
}

interface JoinedEvent {
  player: string;
}

interface RoleAssignedEvent {
  player: string;
  role: string;
}

interface WsException {
  message?: string;
}

interface CreateGameResponse {
  gameId: string;
}

export default function WerewolfGame(): JSX.Element {
  const [userId, setUserId] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [role, setRole] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [creatorGameId, setCreatorGameId] = useState<string>("");
  const [joinedMessages, setJoinedMessages] = useState<string[]>([]);

  const handleCreateGame = async (): Promise<void> => {
    try {
      const res = await axios.post<CreateGameResponse>(
        `${BACKEND_URL}/game/create`,
        {
          userId: "123",
        },
      );
      setUserId("123");
      setCreatorGameId(res.data.gameId);
    } catch (error) {
      console.error("Error creating game:", error);
      showToast("Failed to create game");
    }
  };

  const handleJoinGame = (): void => {
    const sock: Socket = connectToGameSocket(userId, gameId);

    // Handle connection errors
    sock.on("exception", (err: WsException) => {
      console.error("WsException received:", err);
      showToast(err.message || "An error occurred");
    });

    // When the client connects, emit join_game
    sock.on("connect", () => {
      sock.emit("join_game", { userId, gameId });
    });

    // Listen for other players joining
    sock.on("joined", ({ player }: JoinedEvent) => {
      setJoinedMessages((prev: string[]) => [
        ...prev,
        `${player} joined the game`,
      ]);
    });

    // Listen for game start
    sock.on("game-started", (data: GameData) => {
      setGameData(data);
    });

    // Listen for role assignment
    sock.on("role-assigned", ({ player, role }: RoleAssignedEvent) => {
      console.log(`Player ${player} assigned role: ${role}`);
      setRole(role);
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
      <div style={{ padding: "1rem", fontFamily: "Arial" }}>
        <h2>🐺 Werewolf Game</h2>

        {/* Create game (userId = 123) */}
        <button onClick={handleCreateGame}>Create Game (as user 123)</button>

        {creatorGameId && (
          <p>
            Created Game ID: <strong>{creatorGameId}</strong>
          </p>
        )}

        <hr />

        {/* Join game */}
        <div>
          <label>
            User ID:&nbsp;
            <input
              value={userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserId(e.target.value)
              }
              placeholder="Enter your user ID"
            />
          </label>
          <br />
          <label>
            Game ID:&nbsp;
            <input
              value={gameId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGameId(e.target.value)
              }
              placeholder="Enter game ID"
            />
          </label>
          <br />
          <button onClick={handleJoinGame} disabled={!userId || !gameId}>
            Join Game
          </button>
        </div>

        <hr />

        {/* In-game view */}
        {socket && (
          <div>
            <p>
              Connected as <strong>{userId}</strong> in game{" "}
              <strong>{gameId}</strong>
            </p>
            {userId === "123" && (
              <button onClick={handleStartGame}>🚀 Start Game</button>
            )}

            <h4>🧍 Players Joining:</h4>
            <ul>
              {joinedMessages.map((msg: string, idx: number) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
            {gameData && (
              <div>
                <h3>🎮 Game Data:</h3>
                <pre>{JSON.stringify(gameData, null, 2)}</pre>
              </div>
            )}

            {/* Display role if assigned */}
            <h3>🔍 Role Assignment</h3>
            {role && (
              <div>
                <h3>
                  🧙 Your Role: <span style={{ color: "green" }}>{role}</span>
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
