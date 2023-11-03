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

@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: userSchema}])],
  controllers: [SignupController, LoginController, PasswordResetController],
  providers: [SignupService, LoginService, PasswordResetService]
})
export class AuthenticationModule {}
