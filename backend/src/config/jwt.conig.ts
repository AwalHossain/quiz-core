import { JwtModuleOptions } from "@nestjs/jwt";
import { jwtConstants } from "../common/constant";
export const jwtConfig: JwtModuleOptions = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: "1d" },
};
