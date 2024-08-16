import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'username', required: true })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', required: true })
  @IsString()
  password: string;
}
