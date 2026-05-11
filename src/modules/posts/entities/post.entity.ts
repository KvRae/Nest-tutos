import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Post ID' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Post title' })
  title!: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Post content' })
  content!: string;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'Author ID' })
  authorId!: string;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Is post published' })
  isPublished!: boolean;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: 'Number of views' })
  views!: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Post created at' })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Post updated at' })
  updatedAt!: Date;
}

