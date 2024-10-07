import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (user) throw new HttpException('User not found', 404);
    return this.prisma.user.create({
      data,
      include: { Submission: true, Result: true },
    });
  }
}
