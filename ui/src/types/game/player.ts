export type Player = {
  id: string;
  role?: string;
  isConnected: boolean;
  username: string;
  isAlive?: boolean;
};

export type PlayerData = {
  id: string;
  username: string;
  role?: string;
  channels?: {
    name: string;
    isActive: boolean;
    subscriptionType: SubscriptionType;
  }[];
};

export enum SubscriptionType {
  READ_WRITE, // Can send and receive messages
  READ_ONLY, // Can only receive messages
}

export type User = {
  id: string;
  username: string;
  avatarUrl?: string;
};
