import { SocketMessage } from 'src/socket/events/types/events';

// General game events
export type Started = SocketMessage<'started'>;
export type GameOver = SocketMessage<'over'>;

export type AssignRole = SocketMessage<
  'assign-role',
  { playerId: string; role: string }
>;
export type StartRound = SocketMessage<
  'start-round',
  { round: number; duration: number }
>;
export type EndRound = SocketMessage<'end-round'>;

// I. Night events
export type StartNight = SocketMessage<'start-night'>;
export type EndNight = SocketMessage<'end-night'>;

//   1. Cupid events (Only for first night == Round 1)
export type CupidWakeUp = SocketMessage<'cupid-wake-up'>;
export type CupidPickDone = SocketMessage<'cupid-pick-done'>;

//   2. Werewolves events
export type WerewolvesWakeUp = SocketMessage<'werewolves-wake-up'>;
export type WerewolvesPickDone = SocketMessage<'werewolves-pick-done'>;

//   3. Seer events
export type SeerWakeUp = SocketMessage<'seer-wake-up'>;
export type SeerPeekDone = SocketMessage<'seer-peek-done'>;

//   4. Witch events
export type WitchWakeUp = SocketMessage<'witch-wake-up'>;
export type WitchPickDone = SocketMessage<'witch-pick-done'>;

// II. Day events
export type DayTime = SocketMessage<'start-day'>;
export type DayTimeOver = SocketMessage<'end-day'>;

//   1. Announcement events
export type Announcement = SocketMessage<
  'announcement',
  {
    killedByWerewolves: string | null;
    savedByWitch: string | null;
    killedByWitch: string | null;
    peekedBySeer: string | null;
  }
>;

//   2. Voting events
export type StartVoting = SocketMessage<'start-voting'>;
export type PlayerVoted = SocketMessage<
  'player-voted',
  { player: string; votedFor: string | null }
>;
export type VoteDone = SocketMessage<'vote-done'>;
export type VoteResult = SocketMessage<
  'vote-result',
  { player: string; votedFor: string | null }
>;
export type EndVoting = SocketMessage<'end-voting'>;

export type GameServerEvent =
  | Started
  | GameOver
  | AssignRole
  | StartRound
  | EndRound
  | StartNight
  | EndNight
  | CupidWakeUp
  | CupidPickDone
  | WerewolvesWakeUp
  | WerewolvesPickDone
  | SeerWakeUp
  | SeerPeekDone
  | WitchWakeUp
  | WitchPickDone
  | DayTime
  | DayTimeOver
  | Announcement
  | StartVoting
  | PlayerVoted
  | VoteDone
  | VoteResult
  | EndVoting;
