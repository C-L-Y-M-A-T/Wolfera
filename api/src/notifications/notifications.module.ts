import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { NotificationExistsPipe } from './customPipes/notification-exists.pipe';
import { UserExistsPipe } from './customPipes/user-exists.pipe';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, UserExistsPipe, NotificationExistsPipe],
})
export class NotificationModule {}
