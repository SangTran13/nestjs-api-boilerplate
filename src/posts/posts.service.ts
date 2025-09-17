import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
    private postListCacheKeys: Set<string> = new Set();
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) { }

    private generatePostsListCacheKey(query: FindPostsQueryDto): string {
        const { page = 1, limit = 10, title } = query;
        return `posts_list_page_${page}_limit_${limit}_title_${title || 'all'}`;
    }

    async findAll(query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
        const cacheKey = this.generatePostsListCacheKey(query);
        this.postListCacheKeys.add(cacheKey);
        const getCachedData = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);

        if (getCachedData) {
            return getCachedData;
        }

        const { page = 1, limit = 10, title } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.authorName', 'authorName')
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        if (title) {
            queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });
        }

        const [items, totalItems] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(totalItems / limit);
        const responseResult = {
            items,
            meta: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems,
                totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages,
            },
        };
        await this.cacheManager.set(cacheKey, responseResult, 30 * 1000); // Cache for 30 seconds
        return responseResult;
    }

    async findOne(id: number): Promise<any> {
        const cacheKey = `post_${id}`;
        const cachedPost = await this.cacheManager.get<any>(cacheKey);
        if (cachedPost) {
            return cachedPost;
        }
        const post = await this.postsRepository.findOne({ where: { id }, relations: ['authorName'] });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        const result = {
            id: post.id,
            title: post.title,
            content: post.content,
            authorName: {
                name: post.authorName?.name
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
        await this.cacheManager.set(cacheKey, result, 30 * 1000);
        return result;
    }

    async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
        const newPost = this.postsRepository.create({
            ...createPostData,
            authorName,
        });

        // Invalidate all cached post lists
        await this.invalidateAllExistingListCaches();

        return this.postsRepository.save(newPost);
    }

    async update(id: number, updatePostData: UpdatePostDto, user: User): Promise<Post> {
        const post = await this.findOne(id);

        if (post.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException(`You do not have permission to update this post`);
        }

        Object.assign(post, updatePostData);
        post.updatedAt = new Date();

        const updatedPost = await this.postsRepository.save(post);

        await this.cacheManager.del(`post_${id}`);
        await this.invalidateAllExistingListCaches();

        return updatedPost;
    }

    async remove(id: number): Promise<void> {
        const result = await this.postsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        await this.cacheManager.del(`post_${id}`);
        await this.invalidateAllExistingListCaches();
    }

    private async invalidateAllExistingListCaches(): Promise<void> {
        for (const key of this.postListCacheKeys) {
            await this.cacheManager.del(key);
        }
        
        this.postListCacheKeys.clear();
    }
}
