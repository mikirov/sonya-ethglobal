/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Adjust this path to your actual User entity path

import {PrivyClient} from '@privy-io/server-auth';

@Injectable()
export class TokenAuthGuard implements CanActivate {

    private readonly logger = new Logger(TokenAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject UserRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No Bearer token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Check if the token is a valid JWT from the app
      const privy = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET);
      const jwtPayload = await privy.verifyAuthToken(token);
      this.logger.log(jwtPayload);
      if (jwtPayload) {
        const user = await this.userRepository.findOne({
          where: { id: jwtPayload.userId },
        });
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        request.user = user; // Set req.user with the user record from the DB
        return true;
      }
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`);
    }

    // If none of the above validations passed, throw an unauthorized exception
    throw new UnauthorizedException('Invalid token');
  }
}
