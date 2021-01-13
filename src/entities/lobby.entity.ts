import User from "entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Lobby extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column({ unique: true })
    code: string;

    @Column()
    ownerId: number

    @Column("boolean", { default: true })
    is_private: boolean

    @ManyToMany(type => User, user => user.lobbies)
    // @JoinTable({
    //     name: "user_lobby",
    //     joinColumns: [
    //         {name: 'lobbyId', referencedColumnName: "id"}
    //     ],
    //     inverseJoinColumns: [
    //         {name: 'userId', referencedColumnName: "id"}
    //     ]
    // })
    users: User[]

    // @CreateDateColumn()
    // created_at: Date
}