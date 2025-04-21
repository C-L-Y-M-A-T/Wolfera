// src/roles/role.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { GamePhase } from 'src/game/classes/GamePhase';
import { RoleModuleSchema } from 'src/roles';

@Injectable()
export class RoleService implements OnModuleInit {
  private roles = new Map(); // Format: { [roleId]: { roleData, nightPhase? } }

  async onModuleInit() {
    await this.loadRoles();
  }
  validateRoleModule(module: unknown) {
    // Parse with Zod (throws if invalid)
    const result = RoleModuleSchema.parse(module);

    // Additional check for nightPhase
    if (
      result.nightPhase &&
      !(result.nightPhase.prototype instanceof GamePhase)
    ) {
      throw new Error('nightPhase must extend GamePhase');
    }

    return result;
  }

  private async loadRoles() {
    const rolesDir = path.join(__dirname, '../../../roles');
    const roleFolders = (await fs.readdir(rolesDir)).filter(
      (f) => !f.includes('.'),
    ); // Skip files

    for (const folder of roleFolders) {
      try {
        const module = (await import(path.join(rolesDir, folder))).default;
        this.validateRoleModule(module);
        this.roles.set(module.data.name, module);
      } catch (error) {
        console.error(`Failed to load role ${folder}:`);
        throw error;
      }
    }
    console.log(
      'Roles loaded:',
      Array.from(this.roles.values()).map((r) => r),
    );
  }

  // Get all roles (for lobby/assignment)
  getAllRoles() {
    return Array.from(this.roles.values()).map((r) => r.roleData);
  }

  // Get a specific role's config
  getRole(roleId) {
    return this.roles.get(roleId);
  }

  // Get only roles with night actions, sorted by priority
  getNightPhaseRoles() {
    return Array.from(this.roles.values())
      .filter((role) => role.roleData.canActAtNight)
      .sort(
        (a, b) =>
          (a.roleData.nightPriority || 0) - (b.roleData.nightPriority || 0),
      );
  }
}
