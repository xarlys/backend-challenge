import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'password', required: false })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'parentUserId', required: false })
  @IsOptional()
  @IsUUID()
  parentUserId?: string;
}
