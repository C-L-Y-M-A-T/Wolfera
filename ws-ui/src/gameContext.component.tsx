import { JSX } from "react";
import { GameData, Player, User } from "./types";

interface GameContextComponentProps {
  gameData: GameData | null;
  currentUser: User;
  role: string;
}

export default function GameContextComponent({
  gameData,
  currentUser,
  role,
}: GameContextComponentProps): JSX.Element {
  if (!gameData) {
    return (
      <div className="game-context-container">
        <div className="game-context-card">
          <h4>🎮 Game Context</h4>
          <p>No game data available</p>
        </div>
      </div>
    );
  }

  const alivePlayers = gameData.players?.filter(
    (player) => player.isAlive !== false,
  );
  const deadPlayers = gameData.players?.filter(
    (player) => player.isAlive === false,
  );

  return (
    <div className="game-context-container">
      <div className="game-context-card">
        <div className="game-context-header">
          <h4>🎮 Game Context</h4>
          <span className="game-id">ID: {gameData.gameId}</span>
        </div>

        <div className="game-info">
          <div className="info-row">
            <span className="label">Phase:</span>
            <span className="value phase-badge">{gameData.phase}</span>
          </div>

          {role && (
            <div className="info-row">
              <span className="label">Your Role:</span>
              <span className="value role-badge">{role}</span>
            </div>
          )}

          <div className="info-row">
            <span className="label">Players:</span>
            <span className="value">{alivePlayers?.length || 0} alive</span>
            {deadPlayers?.length > 0 && (
              <span className="dead-count">
                ({deadPlayers?.length || 0} dead)
              </span>
            )}
          </div>

          {gameData.owner && (
            <div className="info-row">
              <span className="label">Owner:</span>
              <span className="value">
                {gameData.owner.profile?.name || gameData.owner.id}
              </span>
            </div>
          )}
        </div>

        {gameData.players?.length > 0 && (
          <div className="players-list">
            <h5>Players:</h5>
            <div className="players-grid">
              {gameData.players.map((player: Player) => (
                <div
                  key={player.id}
                  className={`player-item ${player.id === currentUser.id ? "current-player" : ""} ${player.isAlive === false ? "dead-player" : ""}`}
                >
                  <div className="player-info">
                    <span className="player-name">
                      {player.profile?.name || player.id}
                      {player.id === currentUser.id && " (You)"}
                      {player.role && (
                        <span
                          className="player-role"
                          style={{
                            marginLeft: 6,
                            fontSize: 11,
                            color: "#7b1fa2",
                          }}
                        >
                          [{player.role}]
                        </span>
                      )}
                    </span>
                    <div className="player-status">
                      <span
                        className={`connection-status ${player.isConnected ? "connected" : "disconnected"}`}
                      >
                        {player.isConnected ? "🟢" : "🔴"}
                      </span>
                      {player.isAlive === false && (
                        <span className="death-marker">💀</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameData.roles && gameData.roles.length > 0 && (
          <div className="roles-summary">
            <h5>Roles in Game:</h5>
            <div className="roles-list">
              {gameData.roles.map((roleData, index) => (
                <span key={index} className={`role-tag ${roleData.team}`}>
                  {roleData.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .game-context-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          max-width: 300px;
          font-family: Arial, sans-serif;
        }

        .game-context-card {
          background: #fff;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .game-context-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }

        .game-context-header h4 {
          margin: 0;
          color: #333;
          font-size: 16px;
        }

        .game-id {
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        .game-info {
          margin-bottom: 12px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .label {
          color: #666;
          font-weight: 500;
        }

        .value {
          color: #333;
          font-weight: 600;
        }

        .phase-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .role-badge {
          background: #f3e5f5;
          color: #7b1fa2;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .dead-count {
          color: #d32f2f;
          font-size: 12px;
          margin-left: 4px;
        }

        .players-list h5,
        .roles-summary h5 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .players-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }

        .player-item {
          padding: 6px 8px;
          border-radius: 6px;
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
        }

        .player-item.current-player {
          background: #e8f5e8;
          border-color: #4caf50;
        }

        .player-item.dead-player {
          background: #ffebee;
          border-color: #f44336;
          opacity: 0.7;
        }

        .player-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .player-name {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .player-status {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .connection-status {
          font-size: 10px;
        }

        .death-marker {
          font-size: 12px;
        }

        .roles-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .role-tag {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 8px;
          font-weight: 500;
        }

        .role-tag.villagers {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .role-tag.werewolves {
          background: #ffebee;
          color: #c62828;
        }

        /* Make it responsive */
        @media (max-width: 768px) {
          .game-context-container {
            position: relative;
            top: auto;
            right: auto;
            max-width: 100%;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
