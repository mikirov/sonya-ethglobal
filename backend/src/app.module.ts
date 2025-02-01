import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InputController } from './input/input.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    AuthModule,
  ],
  controllers: [InputController],
  providers: [],
})
export class AppModule {}
