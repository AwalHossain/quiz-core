import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UsersService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post("/create")
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Get("/all")
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
