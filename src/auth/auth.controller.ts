import { Body, Controller, Res, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

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
}
