import { IsNotEmpty, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Post content' })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({ description: 'Author ID' })
  @IsNotEmpty()
  @IsUUID()
  authorId!: string;
}

export class UpdatePostDto {
  @ApiProperty({ description: 'Post title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Post content', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Is post published', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class PostResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  authorId!: string;

  @ApiProperty()
  isPublished!: boolean;

  @ApiProperty()
  views!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

