import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator/types/decorator/decorators';
import { BaseFindManyParams } from 'src/utils/dto/find.many.params.dto';

export class FindManyUsersParams extends BaseFindManyParams {
  @IsOptional()
  @IsString()
  username?: string;
  @IsEmail()
  @IsString()
  email?: string;
  // Add more fields as needed
}
