import { Module } from '@nestjs/common';
import { SignupController } from './signup/signup.controller';
import { SignupService } from './services/signup/signup.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose'
import { userSchema } from './Schema/user.schema';
import { LoginService } from './services/login/login.service';
import { LoginController } from './login/login.controller';
import { PasswordResetController } from './password-reset/password-reset.controller';
import { PasswordResetService } from './services/password-reset/password-reset.service';
import { ForgotPasswordController } from './forgot-password/forgot-password/forgot-password.controller';
import { ForgotPasswordService } from './services/forgot-password/forgot-password.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './services/strategy/access-token.strategy';
import { RefreshTokenStrategy } from './services/strategy/refresh-token-strategy';
import { LogoutController } from './logout/logout.controller';
import { LogoutService } from './services/logout/logout.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }]), JwtModule.register({})],
  controllers: [SignupController, LoginController, PasswordResetController, ForgotPasswordController, LogoutController],
  providers: [SignupService, LoginService, PasswordResetService, ForgotPasswordService, AccessTokenStrategy, RefreshTokenStrategy, LogoutService]
})
export class AuthenticationModule { }
