import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({ example: 'username', required: true })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', required: true })
  @IsString()
  password: string;

  @ApiProperty({ example: 'parentUserId', required: false })
  @IsString()
  @IsOptional()
  parentUserId: string;
}
