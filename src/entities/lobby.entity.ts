import User from "entities/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Lobby {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column({ unique: true })
    code: string;

    @Column()
    ownerId: number

    @Column()
    is_private: boolean

    @ManyToMany(type => User, user => user.lobbies)
    @JoinTable()
    users: User[]

    @CreateDateColumn()
    created_at: Date
}