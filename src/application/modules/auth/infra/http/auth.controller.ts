import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/application/modules/user/services/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDTO } from '../../dtos/login.dto';
import { RegisterDTO } from '../../dtos/register.dto';
import { JwtAuthGuard } from 'src/application/util/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Registers a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error registering user.',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() input: RegisterDTO, @Res() res: Response) {
    try {
      const user = await this.userService.create(
        input.username,
        input.password,
        input.parentUserId,
      );

      return res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error register user',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Logs in a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginDTO, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(
        input.username,
        input.password,
      );

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Unauthorized',
        });
      }

      const token = await this.authService.login(user);

      const cookie = res.cookie('jwt', token.access_token, {
        httpOnly: true,
        secure: false,
      });

      //'implement cookie logic'
      if (cookie === undefined || cookie !== null) {
        return res.status(HttpStatus.OK).json({
          message: 'Login successful',
          token: token.access_token,
        });
      }

      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logs out a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout successful.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    try {
      res.clearCookie('jwt');
      return res.json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: error.message,
      });
    }
  }
}
