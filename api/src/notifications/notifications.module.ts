import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), EventEmitterModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
