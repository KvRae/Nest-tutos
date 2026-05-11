import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostRepository } from './repositories/post.repository';
import { CreatePostDto, UpdatePostDto, PostResponseDto } from './dto/post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private postRepository: PostRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    try {
      const post = this.postRepository.create(createPostDto);
      const savedPost = await this.postRepository.save(post);

      this.logger.log(`Post created: ${savedPost.id}`);
      return this.mapToResponseDto(savedPost);
    } catch (error) {
      this.logger.error(`Error creating post: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getAllPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: PostResponseDto[]; total: number; page: number }> {
    try {
      const skip = (page - 1) * limit;

      const [posts, total] = await this.postRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['author'],
      });

      return {
        data: posts.map((post: Post) => this.mapToResponseDto(post)),
        total,
        page,
      };
    } catch (error) {
      this.logger.error(`Error fetching posts: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getPostById(id: string): Promise<PostResponseDto> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['author'],
      });

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      await this.postRepository.incrementViewCount(id);
      post.views += 1;

      return this.mapToResponseDto(post);
    } catch (error) {
      this.logger.error(`Error fetching post: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    try {
      const post = await this.postRepository.findOne({ where: { id } });

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(post, updatePostDto);
      const updatedPost = await this.postRepository.save(post);

      this.logger.log(`Post updated: ${id}`);
      return this.mapToResponseDto(updatedPost);
    } catch (error) {
      this.logger.error(`Error updating post: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async deletePost(id: string): Promise<{ message: string }> {
    try {
      const post = await this.postRepository.findOne({ where: { id } });

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      await this.postRepository.remove(post);
      this.logger.log(`Post deleted: ${id}`);

      return { message: 'Post deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting post: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private mapToResponseDto(post: Post): PostResponseDto {
    return post as PostResponseDto;
  }
}

