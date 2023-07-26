import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
