import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) { }

    async findAll(): Promise<any[]> {
        const posts = await this.postsRepository.find({ relations: ['authorName'] });
        return posts.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            authorName: {
                name: post.authorName?.name
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));
    }

    async findOne(id: number): Promise<any> {
        const post = await this.postsRepository.findOne({ where: { id }, relations: ['authorName'] });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            authorName: {
                name: post.authorName?.name
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }

    async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
        const newPost = this.postsRepository.create({
            ...createPostData,
            authorName,
        });
        return this.postsRepository.save(newPost);
    }

    async update(id: number, updatePostData: UpdatePostDto, user: User): Promise<Post> {
        const post = await this.findOne(id);

        if (post.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException(`You do not have permission to update this post`);
        }

        Object.assign(post, updatePostData);
        post.updatedAt = new Date();

        return this.postsRepository.save(post);
    }

    async remove(id: number): Promise<void> {
        const result = await this.postsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
    }
}
