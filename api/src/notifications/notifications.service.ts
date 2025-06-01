import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationPayload } from './notification-payload';

@Injectable()
export class NotificationService {
  private streams: Map<string, Subject<Notification>> = new Map();

  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  getNotificationStream(userId: string): Observable<Notification> {
    if (!this.streams.has(userId)) {
      this.streams.set(userId, new Subject<Notification>());
    }
    return this.streams.get(userId)!.asObservable();
  }

  async sendNotification(
    userId: string,
    notificationData: NotificationPayload,
  ) {
    const notification = this.notifRepo.create({
      ...notificationData,
      recipientId: userId,
    });
    const persist = [
      NotificationType.FRIEND_REQUEST,
      NotificationType.NEW_ACHIEVEMENT,
    ].includes(notification.type);
    if (persist) {
      await this.notifRepo.save(notification);
    }
    if (this.streams.has(userId)) {
      this.streams.get(userId)!.next(notification);
    }
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
}
