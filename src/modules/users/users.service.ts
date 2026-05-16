import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findUserByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create new user
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created: ${savedUser.id}`);

      return this.mapToResponseDto(savedUser);
    } catch (error) {
      this.logger.error(`Error creating user: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: UserResponseDto[]; total: number; page: number }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        data: users.map((user: User) => this.mapToResponseDto(user)),
        total,
        page,
      };
    } catch (error) {
      this.logger.error(`Error fetching users: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return this.mapToResponseDto(user);
    } catch (error) {
      this.logger.error(`Error fetching user: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check if email is already taken
      if (
        updateUserDto.email &&
        updateUserDto.email !== user.email
      ) {
        const existingUser = await this.userRepository.findUserByEmail(
          updateUserDto.email,
        );
        if (existingUser) {
          throw new HttpException(
            'Email already in use',
            HttpStatus.CONFLICT,
          );
        }
      }

      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);

      this.logger.log(`User updated: ${id}`);
      return this.mapToResponseDto(updatedUser);
    } catch (error) {
      this.logger.error(`Error updating user: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.remove(user);
      this.logger.log(`User deleted: ${id}`);

      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting user: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const { password, ...result } = user;
    return result as UserResponseDto;
  }
}

