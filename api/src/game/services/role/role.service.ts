// src/roles/role.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { assert } from 'console';
import * as fs from 'fs/promises';
import * as path from 'path';
import { GameRole, RoleName, RoleSchema } from 'src/roles';

@Injectable()
export class RoleService implements OnModuleInit {
  private roles: Map<RoleName, GameRole> = new Map();

  async onModuleInit() {
    await this.loadRoles();
  }
  validateRole(role: unknown): GameRole {
    const result = RoleSchema.parse(role);

    return result as GameRole;
  }

  private async loadRoles() {
    const rolesDir = path.join(__dirname, '../../../roles');
    const roleFolders = (await fs.readdir(rolesDir)).filter(
      (f) => !f.includes('.'),
    ); // Skip files

    for (const folder of roleFolders) {
      try {
        const rawRole = (await import(path.join(rolesDir, folder))).default;
        const role = this.validateRole(rawRole);
        assert(role, 'Role validation failed');
        this.roles.set(role.roleData.name, role);
      } catch (error) {
        console.error(`Failed to load role ${folder}:`);
        throw error;
      }
    }

    console.log(
      'Roles loaded:',
      Array.from(this.roles.values()).map((r) => r),
    );
    this.checkForDuplicatePriorities();
  }

  private checkForDuplicatePriorities() {
    const priorityMap = new Map<number, string[]>();
    for (const role of this.roles.values()) {
      const priority = role.nightPhase?.nightPriority;
      if (priority) {
        if (!priorityMap.has(priority)) {
          priorityMap.set(priority, []);
        }
        priorityMap.get(priority)?.push(role.roleData.name);
      }
    }

    for (const [priority, roleNames] of priorityMap.entries()) {
      if (roleNames.length > 1) {
        console.warn(
          `Warning: Multiple roles have the same priority (${priority}): ${roleNames.join(
            ', ',
          )}`,
        );
      }
    }

    const rolesWithNightPhase = Array.from(this.roles.values())
      .filter((role) => role.nightPhase)
      .sort(
        (a, b) =>
          (a.nightPhase?.nightPriority || -1) -
          (b.nightPhase?.nightPriority || -1),
      );

    const rolesWithoutNightPhase = Array.from(this.roles.values()).filter(
      (role) => role.nightPhase === undefined,
    );

    console.log('Night Roles sorted by priority:');
    for (const role of rolesWithNightPhase) {
      console.log(
        `-${role.nightPhase?.nightPriority || -1}- ${role.roleData.name} `,
      );
    }

    console.log('Roles without night phase:');
    if (rolesWithoutNightPhase.length > 0) {
      for (const role of rolesWithoutNightPhase) {
        console.log(`- ${role.roleData.name}`);
      }
    } else {
      console.log(' -- none --');
    }
  }

  // Get all roles (for lobby/assignment)
  getAllRoles() {
    return Array.from(this.roles.values()).map((r) => r.roleData);
  }

  // Get a specific role's config
  getRole(roleName: RoleName) {
    return this.roles.get(roleName);
  }
}
