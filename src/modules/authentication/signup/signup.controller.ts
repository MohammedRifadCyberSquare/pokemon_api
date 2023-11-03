import { Controller, Body, Post } from '@nestjs/common';
import { SignupService } from '../services/signup/signup.service';
import { log } from 'console';

@Controller('signup')
export class SignupController {

    constructor(private signupService: SignupService){}

@Post()
async createUSer(@Body() user){
     

    return this.signupService.userSignup(user)
}


@Post('verify-email')
async verifyEmail(@Body() user){
     

    return this.signupService.verifyEmailService(user.email, user.otp)
}


}
