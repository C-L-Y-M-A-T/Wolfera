import { RoleName } from 'src/roles';

export enum PhaseState {
  Pending = 'pending',
  Pre = 'pre',
  Active = 'active',
  Post = 'post',
  Completed = 'completed',
}

//TODO: to think about the options we want to add
export type GameOptions = {
  roles: Record<RoleName, number>;
  totalPlayers: number;
};

export type PhaseName = `${string}-phase`;

//TODO: to implement type
export type PlayerAction = { action: string; data?: any };
