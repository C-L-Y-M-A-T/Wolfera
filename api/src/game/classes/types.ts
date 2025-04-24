export enum PhaseState {
  Pending = 'pending',
  Pre = 'pre',
  Active = 'active',
  Post = 'post',
  Completed = 'completed',
}
export type PhaseName = `${string}-phase`;

//TODO: to implement type
export type PlayerAction = { action: string; data?: any };
