import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) { }

    async findAll(): Promise<Post[]> {
        return this.postsRepository.find();
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postsRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    async create(createPostData: CreatePostDto): Promise<Post> {
        const newPost = this.postsRepository.create(createPostData);
        return this.postsRepository.save(newPost);
    }

    async update(id: number, updatePostData: UpdatePostDto): Promise<Post> {
        const post = await this.postsRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        const updatedPost = {
            ...post,
            ...updatePostData,
            updatedAt: new Date(),
        };
        return this.postsRepository.save(updatedPost);
    }

    async remove(id: number): Promise<void> {
        const result = await this.postsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
    }
}
