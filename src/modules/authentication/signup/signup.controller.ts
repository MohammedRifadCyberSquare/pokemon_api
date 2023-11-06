import { Controller, Body, Post } from '@nestjs/common';
import { SignupService } from '../services/signup/signup.service';
import { log } from 'console';

@Controller('signup')
export class SignupController {

    constructor(private signupService: SignupService){}

@Post()
async createUSer(@Body() user){
     
console.log('hittingg', user)
    return this.signupService.userSignup(user)
}


@Post('verify-email')
async verifyEmail(@Body() user){
     
console.log(user);
    return this.signupService.verifyEmailService(user.email, parseInt(user.otp))
}


@Post('resend-otp')
async resendOtp(@Body() user){
     
console.log(user);
    return this.signupService.resendOtpService(user.email)
}


}
