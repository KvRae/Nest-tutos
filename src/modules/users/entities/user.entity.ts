import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'User ID' })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'User first name' })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'User last name' })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @ApiProperty({ description: 'User email' })
  email!: string;

  @Column({ type: 'text', select: false })
  password!: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  @ApiProperty({ description: 'User role' })
  role!: 'user' | 'admin' | 'moderator';

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Is user active' })
  isActive!: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'User created at' })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'User updated at' })
  updatedAt!: Date;
}

