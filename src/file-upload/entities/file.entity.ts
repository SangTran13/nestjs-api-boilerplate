import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class File {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    originalName: string;

    @Column()
    mimeType: string;

    @Column()
    url: string;

    @Column()
    size: number;

    @Column()
    publicId: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => User, { nullable: false })
    uploader: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}