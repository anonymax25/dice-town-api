import User from "entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./chat/message.entity";
import { Game } from "./game/game.entity";

@Entity()
export class Lobby extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @CreateDateColumn()
    created_at: Date

    @Column()
    name: string;

    @Column({ unique: true })
    code: string;

    @Column()
    ownerId: number

    @Column("boolean")
    is_private: boolean

    @Column('boolean')
    isGameStarted: boolean

    @OneToOne(() => Game)
    @JoinColumn()
    game: Game

    @OneToMany(type => Message, message => message.lobby)
    messages: Message[]

    @ManyToMany(type => User, user => user.lobbies)
    users: User[]

}