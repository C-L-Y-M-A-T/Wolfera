import React, { useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000';

export default function WerewolfGame() {
  const [userId, setUserId] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameData, setGameData] = useState(null);
  const [role, setRole] = useState('');
  const [socket, setSocket] = useState(null);
  const [creatorGameId, setCreatorGameId] = useState('');
  const [joinedMessages, setJoinedMessages] = useState([]);

  const handleCreateGame = async () => {
    const res = await axios.post(`${BACKEND_URL}/game/create`, { userId: '123' });
    setUserId('123');
    setCreatorGameId(res.data.gameId);
  };

  const handleJoinGame = () => {
    const sock = io(BACKEND_URL, {
      query: { userId, gameId }
    });

    // When the client connects, emit join_game
    sock.on('connect', () => {
      sock.emit('join_game', { userId, gameId });
    });

    // Listen for other players joining
    sock.on('joined', ({ player }) => {
      setJoinedMessages(prev => [...prev, `${player} joined the game`]);
    });

    // Listen for game start
    sock.on('game-started', (data) => {
      setGameData(data);
    });

    // Listen for role assignment
    sock.on('role-assigned', ({ player, role }) => {
      console.log(`Player ${player} assigned role: ${role}`);
      setRole(role);
    });

    setSocket(sock);
  };

  const handleStartGame = () => {
    if (socket) {
      const payload = {
        activePhase: 'lobby',
        timestamp: Date.now(),
        phasePayload: {
          action: 'start-game'
        }
      };
      socket.emit('player-action', payload);
    }
  };



  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h2>🐺 Werewolf Game</h2>

      {/* Create game (userId = 123) */}
      <button onClick={handleCreateGame}>Create Game (as user 123)</button>

      {creatorGameId && (
        <p>Created Game ID: <strong>{creatorGameId}</strong></p>
      )}

      <hr />

      {/* Join game */}
      <div>
        <label>User ID:&nbsp;
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
          />
        </label>
        <br />
        <label>Game ID:&nbsp;
          <input
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
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
          <p>Connected as <strong>{userId}</strong> in game <strong>{gameId}</strong></p>
          {userId === '123' && (
            <button onClick={handleStartGame}>🚀 Start Game</button>
          )}

          <h4>🧍 Players Joining:</h4>
          <ul>
            {joinedMessages.map((msg, idx) => (
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
              <h3>🧙 Your Role: <span style={{ color: 'green' }}>{role}</span></h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
