import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '@/common/decorator/public.decorator';
import { ResponseDto } from '@/common/dto/response.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.generateTokens({
      id: user.id,
      role: user.role,
    });
    return new ResponseDto('login succeed', token);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return new ResponseDto('register succeed', user);
  }
}
