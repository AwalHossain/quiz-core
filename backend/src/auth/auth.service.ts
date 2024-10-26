import { HttpException, Injectable } from "@nestjs/common";

import { UsersService } from "../user/user.service";
import { JwtTokenService } from "./jwt.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtTokenService
  ) {}

  async signUp(username: string, password: string) {
    const user = await this.usersService.createUser({ username, password });
    if (!user) throw new HttpException("User not found", 404);
    // if (user.password !== password) throw new HttpException("Invalid password", 401);
    const payload = { sub: user.id, username: user.username };
    console.log(payload, "payload", user);

    return {
      access_token: await this.jwtTokenService.generateToken(payload),
    };
  }

  async signIn(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username, password);
    if (!user) throw new HttpException("User not found", 404);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtTokenService.generateToken(payload),
    };
  }
}
