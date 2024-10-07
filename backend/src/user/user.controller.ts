import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post('/create')
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }
}
