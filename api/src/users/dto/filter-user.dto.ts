import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseFilterParams } from 'src/utils/dto/base.filter.dto';

export class FilterUserDto extends BaseFilterParams {
  @IsString()
  @IsOptional()
  id?: string;
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
