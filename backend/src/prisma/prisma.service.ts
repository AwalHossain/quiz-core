import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('Connect to db'))
      .catch((err: string) => console.log(err));
  }

  async onModuleDestroy() {
    await this.$disconnect()
      .then(() => console.log('Dissconnect from db'))
      .catch((err: string) => console.log(err));
  }
}
