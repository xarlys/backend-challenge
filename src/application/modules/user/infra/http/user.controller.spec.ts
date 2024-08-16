import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserController } from './user.controller';
import { UserService } from '../../services/user.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    userService = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    } as any;

    userController = new UserController(userService);

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const result = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];
      (userService.getAll as any).mockResolvedValue(result);

      const response = await userController.getAll();
      expect(response).toBe(result);
    });

    it('should handle exceptions', async () => {
      (userService.getAll as any).mockRejectedValue(
        new Error('Error fetching users'),
      );

      const response = await userController.getAll();
      expect(response).toEqual({
        message: 'Error fetching users',
        error: 'Error fetching users',
      });
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const result = { id: '1', name: 'User 1' };
      (userService.getById as any).mockResolvedValue(result);

      const response = await userController.getById('1');
      expect(response).toBe(result);
    });

    it('should handle exceptions', async () => {
      (userService.getById as any).mockRejectedValue(
        new Error('Error fetching user'),
      );

      const response = await userController.getById('1');
      expect(response).toEqual({
        message: 'Error fetching user',
        error: 'Error fetching user',
      });
    });
  });

  describe('create', () => {
    beforeEach(() => {
      mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
    });

    it('should create a new user', async () => {
      const createUserDTO = { username: 'newuser', password: 'password' };
      const result = { id: '1', ...createUserDTO };
      (userService.create as any).mockResolvedValue(result);

      await userController.create(createUserDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should handle exceptions on create', async () => {
      const createUserDTO = { username: 'newuser', password: 'password' };
      (userService.create as any).mockRejectedValue(
        new Error('Error creating user'),
      );

      await userController.create(createUserDTO, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error creating user',
        error: 'Error creating user',
      });
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDTO = { id: '1', name: 'Updated User' };
      const result = { ...updateUserDTO };

      (userService.update as any).mockResolvedValue(result);

      await userController.update(
        updateUserDTO.id,
        updateUserDTO,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should handle exceptions on update', async () => {
      const updateUserDTO = { id: '1', name: 'Updated User' };

      (userService.update as any).mockRejectedValue(
        new Error('Error updating user'),
      );

      await userController.update(
        updateUserDTO.id,
        updateUserDTO,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error updating user',
        error: 'Error updating user',
      });
    });
  });

  describe('delete', () => {
    it('should soft delete an existing user', async () => {
      const userId = '1';
      const result = { message: 'User deleted successfully' };

      (userService.softDelete as any).mockResolvedValue(result);

      await userController.delete(userId, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should handle exceptions on soft delete', async () => {
      const userId = '1';

      (userService.softDelete as any).mockRejectedValue(
        new Error('Error deleting user'),
      );

      await userController.delete(userId, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error deleting user',
        error: 'Error deleting user',
      });
    });
  });
});
