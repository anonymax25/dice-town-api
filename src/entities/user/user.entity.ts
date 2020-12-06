import { Lobby } from 'entities/lobby.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @ManyToMany(type => Lobby, lobby => lobby.users, { cascade: true })
  @JoinTable()
  public lobbies: Lobby[]
}

export default User;