import { Module } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from 'modules/testing/test.module';
import { LobbyModule } from 'modules/lobby/lobby.module';
import { join } from 'path';
import { ChatModule } from 'modules/chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { AlertsModule } from 'modules/alerts/alerts.module';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  ENV
} = process.env

const POSTGRES_DB_CONFIG: ConnectionOptions = {
  name: "POSTGRES",
  type: 'postgres',
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  logging: ['error'],
  entities: [join(__dirname, "./entities/**/*.ts")],
  synchronize: true
};
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot(POSTGRES_DB_CONFIG),
    AuthenticationModule,
    UsersModule,
    TestModule,
    LobbyModule,
    ChatModule,
    AlertsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
