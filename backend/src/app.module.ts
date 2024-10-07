import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/users.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
