import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
    private posts: Post[] = [
        {
            id: 1,
            title: 'First Post',
            content: 'This is the content of the first post.',
            authorName: 'Sang Tran Ngoc',
            createdAt: new Date('2024-01-01T10:00:00Z'),
        },
    ];

    findAll(): Post[] {
        return this.posts;
    }

    findOne(id: number): Post {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    create(createPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
        const newPost: Post = {
            id: this.getNextId(),
            ...createPostData,
            createdAt: new Date(),
        };
        this.posts.push(newPost);
        return newPost;
    }

    update(id: number, updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
        const postIndex = this.posts.findIndex(post => post.id === id);
        if (postIndex === -1) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        const updatedPost = {
            ...this.posts[postIndex],
            ...updatePostData,
            updatedAt: new Date(),
        };
        this.posts[postIndex] = updatedPost;
        return updatedPost;
    }

    remove(id: number): void {
        const postIndex = this.posts.findIndex(post => post.id === id);
        if (postIndex === -1) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        this.posts.splice(postIndex, 1);
    }

    private getNextId(): number {
        return this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
    }
}
