import { WsException } from '@nestjs/websockets';
import { GameRole } from 'src/roles';
import { z } from 'zod';
import { GameContext } from '../../GameContext';
import { GamePhase } from '../../GamePhase';
import { Player } from '../../Player';
import { PlayerAction } from '../../types';

export abstract class RolePhase<A = any> extends GamePhase<A> {
  constructor(
    context: GameContext,
    public readonly role: GameRole,
    playerActionPayloadSchema: z.ZodSchema<A>,
  ) {
    super(context, playerActionPayloadSchema);
  }

  protected validatePlayerPermissions(
    player: Player,
    action: PlayerAction<A>,
  ): void {
    if (!player.role || player.role.roleData.name !== this.role.roleData.name) {
      throw new WsException('Player does not have the Witch role');
    }
  }

  get phaseName(): `${string}-phase` {
    return `${this.role.roleData.name}-phase`;
  }
}
