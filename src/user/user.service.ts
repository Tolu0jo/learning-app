import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    role: Role = Role.LEARNER,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        id: uuid(),
        email,
        password_hash: hashedPassword,
        role,
        name,
      },
    });
  }

  async createTeacher(email: string, password: string): Promise<User> {
    return this.createUser(email, password, Role.TEACHER);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return user;
    }
    return null;
  }

  async generateJwtToken(user: User): Promise<string> {
    const payload = { id: user.id, role: user.role };
    const secret = this.configService.get('JWT_SECRET');
    console.log(secret);
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
      secret,
    });
    return token
  }
}
