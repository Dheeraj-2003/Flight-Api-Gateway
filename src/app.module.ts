import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, TCP_HOSTS, USER_SERVICE } from './common/constants';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: TCP_HOSTS.USER_SERVICE
      },
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: TCP_HOSTS.AUTH_SERVICE
      }
    ])
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
