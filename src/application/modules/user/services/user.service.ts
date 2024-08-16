import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../repositories/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll() {
    try {
      return await this.userRepository.find({
        where: { deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error getting users');
    }
  }

  async getById(id: string) {
    try {
      return await this.userRepository.findOne({
        where: { id, deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error getting user');
    }
  }

  async getByUserName(username: string) {
    try {
      return await this.userRepository.findOne({
        where: { username, deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error getting user');
    }
  }

  async getUserTree(parentUserId: string) {
    try {
      const users = await this.userRepository.find();
      return this.buildUserTree(users, parentUserId);
    } catch (error) {
      throw new InternalServerErrorException('Error getting user tree');
    }
  }

  async create(username: string, password: string, parentUserId?: string) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { username },
      });

      if (userExists) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        username,
        password: hashedPassword,
        parentUserId,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async update(inputs: UpdateUserDTO) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: inputs.id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(inputs.password, 10);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...updateData } = inputs;

      const updatedUserData = { ...updateData, password: hashedPassword };

      Object.assign(user, updatedUserData);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error update user');
    }
  }

  async softDelete(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.deletedAt = new Date();
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  private buildUserTree(users: User[], parentId: string | null = null) {
    const children = users.filter((user) => user.parentUserId === parentId);

    return children.map((user) => ({
      ...user,
      children: this.buildUserTree(users, user.id),
    }));
  }
}
