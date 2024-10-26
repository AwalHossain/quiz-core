import { HttpException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUser) throw new HttpException("Username already exists", 400);
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
      },
      select: { id: true, username: true, password: true },
    });
  }

  async findUserByUsername(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true },
    });
    console.log(user, password, "user");

    if (!user) throw new HttpException("User not found", 404);
    // check if password is correct
    if (user.password !== password) throw new HttpException("Invalid password", 401);
    return {
      id: user.id,
      username: user.username,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: { examSession: true, result: true },
    });
  }
}
