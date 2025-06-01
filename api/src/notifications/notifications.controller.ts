import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import { finalize, map, Observable } from 'rxjs';
import { GetNotificationsQueryDto } from './dto/notification-param.dto';
import { NotificationPayload } from './notification-payload';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post(':userId/send')
  async sendNotification(
    @Param('userId') userId: string,
    @Body() notificationdto: NotificationPayload,
  ) {
    await this.notificationService.sendNotification(userId, notificationdto);
  }

  @Sse(':userId/stream')
  streamNotifications(
    @Param('userId') userId: string,
  ): Observable<MessageEvent> {
    return this.notificationService.getNotificationStream(userId).pipe(
      map((notification) => {
        const messageEvent = new MessageEvent('notification', {
          data: notification,
        });
        return messageEvent;
      }),
      finalize(() => {
        this.notificationService.cleanupStream(userId);
      }),
    );
  }

  @Post(':userId/disconnect')
  disconnect(@Param('userId') userId: string): { success: boolean } {
    this.notificationService.cleanupStream(userId);
    return { success: true };
  }

  onModuleDestroy() {
    this.notificationService.cleanupAllStreams();
  }

  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch(':notificationId/unread')
  markAsUnread(@Param('notificationId') id: string) {
    return this.notificationService.markAsUnread(id);
  }

  @Delete(':notificationId')
  deleteNotification(@Param('notificationId') id: string) {
    return this.notificationService.deleteOne({ id });
  }

  @Get(':userId')
  getNotifications(
    @Param('userId') userId: string,
    @Query() query: GetNotificationsQueryDto,
  ) {
    const { filter, ...paginationParams } = query;

    return this.notificationService.getUserNotifications(
      userId,
      filter,
      paginationParams,
    );
  }
}
