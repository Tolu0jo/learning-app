import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: Role = Role.LEARNER,
  ) {
    const user = await this.userService.createUser(name, email, password, role);
    delete user.password_hash;
    return user;
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      return user;
    }
  }

  async login(user: any) {
    return {
      access_token: await this.userService.generateJwtToken(user),
      user: user,
    };
  }
}
