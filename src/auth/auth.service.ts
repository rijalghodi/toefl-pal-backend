import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { User } from 'src/user/entity/user.entity';

import { Role } from '@/common/guard/role.enum';

import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneWithPassword({ email });

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateTokens(user: { id: string; roles: Role[] }) {
    const payload = { sub: user.id, roles: user.roles };

    const access_token = this.jwtService.sign(payload);

    if (!access_token) {
      throw new BadRequestException('Failed to generate token');
    }

    const exp = new Date(this.jwtService.decode(access_token).exp * 1000);
    const expired_at = exp.toISOString();

    return {
      access_token,
      expired_at,
    };
  }

  async register(payload: RegisterDto) {
    const userInUse = await this.userService.checkDuplicate({
      email: payload.email,
    });

    if (userInUse) {
      throw new BadRequestException('user in use');
    }

    const salt = await genSalt();
    const hashedPassword = await hash(payload.password, salt);

    const newUser = await this.userService.createUser({
      ...payload,
      password: hashedPassword,
    });

    return newUser;
  }
}
