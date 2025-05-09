import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async syncFromSupabase(supabaseUser: any): Promise<User> {
    const existing = await this.findById(supabaseUser.id);
    if (existing) return existing;
    console.log('Creating new user from Supabase:', supabaseUser);
    return this.create({
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name || '',
    });
  }
}
