import { Injectable } from '@nestjs/common';
import { GameOptions } from 'src/game/classes/types';
import { roleDetails } from 'src/roles';

@Injectable()
export class GameOptionsValidatorService {
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
    const definedRoleNames = roleDetails.map((r) => r.roleData.name);
    const providedRoleNames = Object.keys(options.roles);

    // Check that all roles are specified in the options
    const missingRoles = definedRoleNames.filter(
      (roleName) => !providedRoleNames.includes(roleName),
    );

    if (missingRoles.length > 0) {
      throw new Error(
        `All roles must be specified in options. Missing: ${missingRoles.join(', ')}`,
      );
    }
    for (const [roleName, count] of Object.entries(options.roles)) {
      const role = roleDetails.find((r) => r.roleData.name === roleName);

      if (!role) {
        throw new Error(`Unknown role: ${roleName}`);
      }

      // Check minimum players constraint
      if (role.roleData.minPlayers && count < role.roleData.minPlayers) {
        throw new Error(
          `Role ${roleName} requires at least ${role.roleData.minPlayers} players, but ${count} specified`,
        );
      }

      // Check maximum players constraint
      if (role.roleData.maxPlayers && count > role.roleData.maxPlayers) {
        throw new Error(
          `Role ${roleName} allows maximum ${role.roleData.maxPlayers} players, but ${count} specified`,
        );
      }
    }
  }
}
