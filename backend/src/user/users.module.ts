import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UserController],
})
export class UserModule {}
