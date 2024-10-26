import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { UserDto } from "./dtos/createUser.dto";
import { AuthGuard } from "./guards/auth.guard";

@ApiTags("Auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login" })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: UserDto,
  })
  @Post("signup")
  async signUp(@Body() data: UserDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.signUp(data.username, data.password);
    // Set the cookie
    res.cookie("auth_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "none", // This is more permissive and easier for testing
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send the response
    res.json({
      message: "User created successfully",
      access_token: access_token, // Include the token in the response body for easy testing
    });
  }

  @ApiOperation({ summary: "Login" })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: UserDto,
  })
  @Post("signin")
  async signIn(@Body() data: UserDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.signIn(data.username, data.password);
    res.cookie("auth_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "User logged in successfully",
      access_token: access_token,
    });
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: Request) {
    return req["user"];
  }
}
