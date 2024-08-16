import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Put,
  HttpCode,
  Delete,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO } from '../../dtos/create-user.dto';
import { UpdateUserDTO } from '../../dtos/update-user.dto';
import { JwtAuthGuard } from 'src/application/util/jwt-auth.guard';
import { User } from '../../repositories/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('User')
@Controller('users')
export class UserController {
  [x: string]: any;
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns the user tree of the logged in user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User fetched.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error fetching user.',
  })
  @Get('tree')
  @HttpCode(HttpStatus.OK)
  async getUserTree(@Req() req: RequestWithUser) {
    try {
      const user = req.user;
      const userId = user.id;
      const tree = await this.userService.getUserTree(userId);
      return tree;
    } catch (error) {
      return {
        message: 'Error fetching user tree',
        error: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetches all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users fetched.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error fetching users.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    try {
      return await this.userService.getAll();
    } catch (error) {
      return {
        message: 'Error fetching users',
        error: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetches a user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User fetched.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error fetching user.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    try {
      return await this.userService.getById(id);
    } catch (error) {
      return {
        message: 'Error fetching user',
        error: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registers a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error registering user.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() input: CreateUserDTO, @Res() res: Response) {
    try {
      const user = await this.userService.create(
        input.username,
        input.password,
        input.parentUserId,
      );
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error creating user',
        error: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Updates an existing user' })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error updating user.',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() input: UpdateUserDTO,
    @Res() res: Response,
  ) {
    try {
      const inputs = { ...input, id };
      const user = await this.userService.update(inputs);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error updating user',
        error: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Deletes an existing user' })
  @ApiParam({ name: 'id', type: 'string', description: 'User id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deleting user.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.softDelete(id);
      return res.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error deleting user',
        error: error.message,
      });
    }
  }
}
