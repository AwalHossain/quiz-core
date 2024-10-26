import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../common/constant";

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
  }
}
