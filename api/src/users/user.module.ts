import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersLoader } from './dataloader/user.loader';
import { User } from './entities/user.entity';
import { UserResolver } from './graphql/user.resolver';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserResolver, UsersLoader],
  exports: [UsersService, UsersLoader],
})
export class UserModule {}
