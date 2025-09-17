import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;
    // Additional fields can be added here
    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => User, user => user.posts)
    authorName: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}