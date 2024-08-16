import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/application/modules/user/services/user.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    compare: vi.fn(),
  };
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    authService = {
      validateUser: vi.fn(),
      login: vi.fn(),
    } as any;

    userService = {
      getByUserName: vi.fn(),
      create: vi.fn(),
    } as any;

    authController = new AuthController(authService, userService);

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn(),
    } as unknown as Response;
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDTO = {
        username: 'newuser',
        password: 'password123',
        parentUserId: null,
      };
      const createdUser = { id: '1', ...registerDTO };

      (userService.create as any).mockResolvedValue(createdUser);

      await authController.register(registerDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: createdUser,
      });
    });

    it('should handle errors during registration', async () => {
      const registerDTO = {
        username: 'newuser',
        password: 'password123',
        parentUserId: null,
      };

      (userService.create as any).mockRejectedValue(
        new Error('Error creating user'),
      );

      await authController.register(registerDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error register user',
        error: 'Error creating user',
      });
    });
  });

  describe('login', () => {
    it('should log in the user successfully', async () => {
      const loginDTO = { username: 'newuser', password: 'password123' };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const validatedUser = {
        id: '1',
        username: 'newuser',
        password: hashedPassword,
      };
      const token = { access_token: 'challenge-secret' };

      (userService.getByUserName as any).mockResolvedValue(validatedUser);

      (bcrypt.compare as any).mockResolvedValue(true);

      (authService.validateUser as any).mockResolvedValue(validatedUser);

      (authService.login as any).mockResolvedValue(token);

      await authController.login(loginDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: token.access_token,
      });
    });

    it('should return unauthorized if validation fails', async () => {
      const loginDTO = { username: 'newuser', password: 'password123' };

      (authService.validateUser as any).mockResolvedValue(null);

      await authController.login(loginDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('should handle errors during login', async () => {
      const loginDTO = { username: 'newuser', password: 'password123' };

      (authService.validateUser as any).mockRejectedValue(
        new Error('Error logging in'),
      );

      await authController.login(loginDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        error: 'Error logging in',
      });
    });
  });
});
