import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { PricingModule } from './pricing/pricing.module';
import { InputModule } from './input/input.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables available globally
    }),
    HttpModule,
    AuthModule,
    PricingModule,
    InputModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
