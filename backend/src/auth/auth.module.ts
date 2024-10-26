import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../common/constant";
import { UserModule } from "../user/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtTokenService } from "./jwt.service";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService],
  exports: [AuthService, JwtTokenService],
})
export class AuthModule {}
