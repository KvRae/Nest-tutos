import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.find({ where: { authorId }, order: { createdAt: 'DESC' } });
  }

  async findPublishedPosts(page: number, limit: number): Promise<[Post[], number]> {
    return this.findAndCount({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.createQueryBuilder()
      .update(Post)
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute();
  }
}

