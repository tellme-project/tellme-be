import { Body, Controller, Res, Post, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  async register(@Res() res, @Body() registerDto: RegisterDto){
    try {
      const user = await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @Post("/login")
  async login(@Res() res, @Body() loginDto: LoginDto){
    try {
      const responseUser = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json(responseUser);
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  async profile(@Req() req){
    return req.user.username;
  }
}
