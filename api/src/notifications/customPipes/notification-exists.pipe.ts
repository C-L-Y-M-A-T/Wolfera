import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { NotificationService } from '../notifications.service';

@Injectable()
export class NotificationExistsPipe implements PipeTransform {
  constructor(private readonly notificationService: NotificationService) {}

  async transform(notificationId: string) {
    if (!notificationId)
      throw new BadRequestException('Notification ID is required');

    const notification =
      await this.notificationService.findById(notificationId);
    if (!notification)
      throw new NotFoundException(`Notification ${notificationId} not found`);

    return notificationId;
  }
}
