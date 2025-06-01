import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Subject } from 'rxjs';
import { PaginationParams } from 'src/utils/dto/pagination.dto';
import { BaseService } from 'src/utils/generic/base.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotificationType } from './Constants/notification-type.enum';
import { NotificationPayload } from './dto/notification-payload';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService extends BaseService<
  Notification,
  NotificationPayload,
  Partial<Notification>
> {
  private streams: Map<string, Subject<Notification>> = new Map();

  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {
    super(notifRepo);
  }

  getNotificationStream(userId: string): Observable<Notification> {
    if (!this.streams.has(userId)) {
      this.streams.set(userId, new Subject<Notification>());
    }
    return this.streams.get(userId)!.asObservable();
  }

  private readonly PERSISTENT_NOTIFICATION_TYPES = [
    NotificationType.FRIEND_REQUEST,
    NotificationType.NEW_ACHIEVEMENT,
  ];

  async sendNotification(
    userId: string,
    notificationData: NotificationPayload,
  ): Promise<{ persisted: boolean; streamed: boolean }> {
    const notification = this.notifRepo.create({
      ...notificationData,
      recipientId: userId,
    });
    const persist = this.PERSISTENT_NOTIFICATION_TYPES.includes(
      notification.type,
    );
    let persisted = false;
    let streamed = false;
    if (persist) {
      try {
        await this.notifRepo.save(notification);
        persisted = true;
      } catch (error) {
        console.error('Failed to persist notification:', error);
        throw error;
      }
    }
    const stream = this.streams.get(userId);
    if (stream) {
      try {
        stream.next(notification);
        streamed = true;
      } catch (error) {
        console.error('Failed to stream notification:', error);
      }
    }
    return { persisted, streamed };
  }

  cleanupStream(userId: string): void {
    if (this.streams.has(userId)) {
      this.streams.get(userId)!.complete();
      this.streams.delete(userId);
    }
  }

  cleanupAllStreams(): void {
    this.streams.forEach((subject) => subject.complete());
    this.streams.clear();
  }

  onModuleDestroy() {
    this.cleanupAllStreams();
  }

  markAsRead(notificationId: string, userId?: string) {
    return this.updateOne({ id: notificationId }, { read: true }, { userId });
  }

  markAsUnread(notificationId: string, userId?: string) {
    return this.updateOne({ id: notificationId }, { read: false }, { userId });
  }

  findById(id: string) {
    return this.findOne({ id });
  }

  async getUserNotifications(
    userId: string,
    filter: 'all' | 'read' | 'unread' = 'all',
    paginationParams: PaginationParams,
  ) {
    const where:
      | FindOptionsWhere<Notification>
      | FindOptionsWhere<Notification>[] = {
      recipientId: userId,
    };

    if (filter === 'read') where.read = true;
    else if (filter === 'unread') where.read = false;

    return this.findAllPaginated(paginationParams, {
      where,
      order: { createdAt: 'DESC' },
    });
  }
}
