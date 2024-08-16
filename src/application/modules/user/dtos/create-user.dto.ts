import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'username', required: true })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', required: true })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'parentUserId', required: false })
  @IsOptional()
  @IsUUID()
  parentUserId?: string;
}
