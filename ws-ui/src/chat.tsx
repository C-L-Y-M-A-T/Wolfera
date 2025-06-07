import React, { useState } from "react";
import { GameData } from "./types";

export enum SubscriptionType {
  READ_WRITE, // Can send and receive messages
  READ_ONLY, // Can only receive messages
}
export type Channel = {
  name: string;
  messages: IncomingMessage[];
  subscriptionType: SubscriptionType;
  isActive: boolean;
};
export type ChannelStatus = {
  channel: string;
  isActive: boolean;
};

type ChatProps = {
  gameData: GameData;
  channels: Channel[];
  onSendMessage?: (channelId: string, message: string) => void;
};

type BaseMessage = {
  id: string;
  type: "player_message" | "system_message";
  content: string;
  channel?: string;
};

export type PlayerMessage = BaseMessage & {
  sender_id: string;
  type: "player_message";
};

export type SystemMessage = BaseMessage & {
  type: "system_message";
};

export type IncomingMessage = PlayerMessage | SystemMessage;

export const Chat: React.FC<ChatProps> = ({
  gameData,
  channels,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState(channels[0]?.name || "");
  const [input, setInput] = useState<{ [key: string]: string }>({});

  const handleSend = (channel: string) => {
    console.log("889 handleSend", channel, "....", input[channel]);
    const message = input[channel]?.trim();
    if (message && onSendMessage) {
      onSendMessage(channel, message);
      setInput((prev) => ({ ...prev, [channel]: "" }));
    }
  };

  const activeChannel = channels.find((ch) => ch.name === activeTab);
  const isReadOnly =
    activeChannel?.subscriptionType === SubscriptionType.READ_ONLY;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 340,
        background: "#222",
        borderRadius: 8,
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
        zIndex: 1000,
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", borderBottom: "1px solid #444" }}>
        {channels.map((ch) => (
          <div
            key={ch.name}
            onClick={() => setActiveTab(ch.name)}
            style={{
              flex: 1,
              padding: "8px 12px",
              cursor: "pointer",
              background: activeTab === ch.name ? "#333" : "transparent",
              color: activeTab === ch.name ? "#fff" : "#aaa",
              borderBottom: activeTab === ch.name ? "2px solid #4af" : "none",
              textAlign: "center",
              fontWeight: 500,
              fontSize: 14,
              userSelect: "none",
            }}
          >
            {ch.name}
          </div>
        ))}
      </div>
      <div
        style={{
          height: 220,
          overflowY: "auto",
          background: "#181818",
          padding: 12,
        }}
      >
        {activeChannel?.messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <span style={{ color: "#4af", fontWeight: 600 }}>
              {msg.type === "player_message"
                ? gameData.players.find((p) => p.id === msg.sender_id)
                    ?.username || "Unknown Player"
                : "System Message"}
            </span>{" "}
            <span style={{ color: "#eee" }}>{msg.content}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #444" }}>
        <input
          type="text"
          value={input[activeTab] || ""}
          onChange={(e) =>
            setInput((prev) => ({ ...prev, [activeTab]: e.target.value }))
          }
          onKeyDown={(e) => {
            if (!isReadOnly && e.key === "Enter") handleSend(activeTab);
          }}
          placeholder={isReadOnly ? "Read only channel" : "Type a message..."}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "none",
            background: "#222",
            color: isReadOnly ? "#888" : "#fff",
            outline: "none",
            fontSize: 14,
          }}
          disabled={isReadOnly}
        />
        <button
          onClick={() => handleSend(activeTab)}
          style={{
            background: isReadOnly ? "#444" : "#4af",
            color: "#fff",
            border: "none",
            padding: "0 18px",
            cursor: isReadOnly ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 14,
          }}
          disabled={isReadOnly}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
