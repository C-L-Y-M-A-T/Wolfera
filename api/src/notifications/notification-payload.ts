import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  NEW_ACHIEVEMENT = 'NEW_ACHIEVEMENT',
  GAME_INVITE = 'GAME_INVITE',
}

export class NotificationPayload {
  @IsEnum(NotificationType)
  type: NotificationType;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  data: any;
}
