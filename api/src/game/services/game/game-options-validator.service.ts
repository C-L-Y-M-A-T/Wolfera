import { Injectable } from '@nestjs/common';
import { GameOptions } from 'src/game/classes/types';
import { RoleService } from './../role/role.service';

@Injectable()
export class GameOptionsValidatorService {
  constructor(private readonly roleService: RoleService) {}
  private readonly MIN_PLAYERS = 4;
  private readonly MAX_PLAYERS = 20;
  /**
   * Validates the provided game options.
   * Throws an error if options are invalid.
   * @param options - Game options
   * @returns void
   */
  validateGameOptions(options: GameOptions): void {
    // Basic validation
    this.validateBasicOptions(options);

    // Role-specific validation
    this.validateRoleConstraints(options);
    // Balance evaluation
    this.evaluateBalance(options);

    console.log('----------------Game options validated successfully');
  }

  private validateBasicOptions(options: GameOptions): void {
    if (!options.totalPlayers || options.totalPlayers < this.MIN_PLAYERS) {
      throw new Error(`Game requires at least ${this.MIN_PLAYERS} players`);
    }

    if (options.totalPlayers > this.MAX_PLAYERS) {
      throw new Error(`Game cannot have more than ${this.MAX_PLAYERS} players`);
    }

    if (!options.roles || Object.keys(options.roles).length === 0) {
      throw new Error('At least one role must be specified');
    }

    // Check if total role count matches total players
    const totalRoleCount = Object.values(options.roles).reduce(
      (sum, count) => sum + count,
      0,
    );
    if (totalRoleCount !== options.totalPlayers) {
      throw new Error(
        `Total role count (${totalRoleCount}) must equal total players (${options.totalPlayers})`,
      );
    }
  }

  private validateRoleConstraints(options: GameOptions): void {
    const allRoles = this.roleService.getAllRoles();

    for (const role of allRoles) {
      const count = options.roles[role.name] ?? 0;

      // Check minimum players constraint
      if (role.minPlayers && count < role.minPlayers) {
        throw new Error(
          `Role ${role.name} requires at least ${role.minPlayers} players, but ${count} specified`,
        );
      }

      // Check maximum players constraint
      if (role.maxPlayers && count > role.maxPlayers) {
        throw new Error(
          `Role ${role.name} allows maximum ${role.maxPlayers} players, but ${count} specified`,
        );
      }
    }

    // Optional: warn or throw for unknown roles (not defined in system)
    const definedRoleNames = allRoles.map((r) => r.name as string);
    const unknownRoles = Object.keys(options.roles).filter(
      (name) => !definedRoleNames.includes(name),
    );

    if (unknownRoles.length > 0) {
      throw new Error(`Unknown role(s): ${unknownRoles.join(', ')}`);
    }
  }
  private evaluateBalance(options: GameOptions): void {
    const allRoles = this.roleService.getAllRoles();
    let villagerPower = 0;
    let werewolfPower = 0;

    for (const role of allRoles) {
      const count = options.roles[role.name] ?? 0;
      const totalPower = count * role.power;

      if (role.team === 'villagers') {
        villagerPower += totalPower;
      } else if (role.team === 'werewolves') {
        werewolfPower += totalPower;
      }
    }

    // Avoid divide-by-zero
    const ratio =
      werewolfPower === 0 ? Infinity : villagerPower / werewolfPower;

    console.log(
      `Balance Ratio: Villagers ${villagerPower} / Werewolves ${werewolfPower} = ${ratio.toFixed(2)}`,
    );

    if (ratio < 0.8) {
      throw new Error('⚠️ Game is likely unbalanced in favor of Werewolves');
    } else if (ratio > 1.2) {
      throw new Error('⚠️ Game is likely unbalanced in favor of Villagers');
    } else {
      console.log('✅ Game appears balanced');
    }
  }
}
