import { type } from "os";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "./inventory";
import { Player } from "./player";

@Entity({name: 'game'})
export class Game extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('boolean')
    gameStarted: boolean

    @Column()
    startTime: Date

    @Column({ type: "text"})
    waitingFor: string[]

    @Column()
    sherifUserid: string

    @Column({ type: 'text'})
    inventory: Inventory

    @Column({ type: 'text'})
    players: Player[]
}