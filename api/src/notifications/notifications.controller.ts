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
import { Paginated } from 'src/utils/decorators/paginated.decorator';
import { NotificationExistsPipe } from './customPipes/notification-exists.pipe';
import { UserExistsPipe } from './customPipes/user-exists.pipe';
import { GetNotificationsQueryDto } from './dto/notification-param.dto';
import { NotificationPayload } from './dto/notification-payload';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post(':userId/send')
  async sendNotification(
    @Param('userId', UserExistsPipe) userId: string,
    @Body() notificationdto: NotificationPayload,
  ) {
    await this.notificationService.sendNotification(userId, notificationdto);
  }

  @Sse(':userId/stream')
  streamNotifications(
    @Param('userId', UserExistsPipe) userId: string,
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

  //add injection of CurrentUserId + AuthGuard
  @Patch(':notificationId/read')
  markAsRead(@Param('notificationId', NotificationExistsPipe) id: string) {
    return this.notificationService.markAsRead(id);
  }

  //add injection of CurrentUserId + AuthGuard
  @Patch(':notificationId/unread')
  markAsUnread(@Param('notificationId', NotificationExistsPipe) id: string) {
    return this.notificationService.markAsUnread(id);
  }

  //add injection of CurrentUserId + AuthGuard
  @Delete(':notificationId')
  deleteNotification(
    @Param('notificationId', NotificationExistsPipe) id: string,
  ) {
    return this.notificationService.deleteOne({ id });
  }

  //add injection of CurrentUserId + AuthGuard
  @Get(':userId')
  @Paginated()
  getNotifications(
    @Param('userId', UserExistsPipe) userId: string,
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
