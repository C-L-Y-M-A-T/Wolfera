import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../Constants/notification-type.enum';

export class NotificationPayload {
  @ApiProperty({
    example: 'GAME_INVITE',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    example: 'Game Invite',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'You have been invited to join a game.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: { gameId: '12345' },
  })
  @IsOptional()
  data: any;
}
