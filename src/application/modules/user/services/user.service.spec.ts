import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../repositories/entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(() => {
    userRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    } as any;

    userService = new UserService(userRepository);
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', username: 'user1' }];
      (userRepository.find as any).mockResolvedValue(users);

      const result = await userService.getAll();
      expect(result).toBe(users);
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      (userRepository.find as any).mockRejectedValue(new Error());

      await expect(userService.getAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', username: 'user1' };
      (userRepository.findOne as any).mockResolvedValue(user);

      const result = await userService.getById('1');
      expect(result).toBe(user);
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      (userRepository.findOne as any).mockRejectedValue(new Error());

      await expect(userService.getById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const username = 'newUser';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const user = { id: '1', username, password: hashedPassword };

      (userRepository.findOne as any).mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue(hashedPassword);
      (userRepository.create as any).mockReturnValue(user);
      (userRepository.save as any).mockResolvedValue(user);

      const result = await userService.create(username, password);
      expect(result).toBe(user);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should throw a ConflictException if the user already exists', async () => {
      const username = 'existingUser';

      (userRepository.findOne as any).mockResolvedValue({ id: '1', username });

      await expect(userService.create(username, 'password')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an InternalServerErrorException when an error occurs', async () => {
      (userRepository.findOne as any).mockRejectedValue(new Error());

      await expect(userService.create('newUser', 'password')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDTO = {
        id: '1',
        username: 'UpdatedUser',
        password: 'newPassword',
      };
      const hashedPassword = 'hashedPassword';
      const updatedUser = { ...updateUserDTO, password: hashedPassword };

      (userRepository.findOne as any).mockResolvedValue({
        id: '1',
        username: 'OldUser',
        password: 'oldPassword',
      });

      (bcrypt.hash as any).mockResolvedValue(hashedPassword);
      (userRepository.save as any).mockResolvedValue(updatedUser);

      const result = await userService.update(updateUserDTO);
      expect(result).toBe(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDTO.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedUser),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const updateUserDTO = {
        id: '1',
        username: 'UpdatedUser',
        password: 'newPassword',
      };
      (userRepository.findOne as any).mockResolvedValue(null);

      await expect(userService.update(updateUserDTO)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user by updating deletedAt', async () => {
      const userId = '1';
      const existingUser = { id: '1', username: 'User', deletedAt: null };
      const now = new Date();

      (userRepository.findOne as any).mockResolvedValue(existingUser);
      (userRepository.save as any).mockResolvedValue({
        ...existingUser,
        deletedAt: now,
      });

      const result = await userService.softDelete(userId);
      expect(result.deletedAt).toBe(now);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ deletedAt: now }),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      (userRepository.findOne as any).mockResolvedValue(null);

      await expect(userService.softDelete('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('buildUserTree', () => {
    it('should return an empty tree if no users are found', async () => {
      (userRepository.find as any).mockResolvedValue([]);

      const result = await userService.getUserTree('1');
      expect(result).toEqual([]);
    });
  });
});
