import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../Schema/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class SignupService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ) { }

    generateOtp() {
        const min = 10000;  
        const max = 99999;  

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async isEmailExist(email: string){
        const user = await this.userModel.findOne({ email }).exec();
        return !!user
    }

    async userSignup(user: User) {

        const response = {}
        const emailTaken = await this.isEmailExist(user.email)
        if(!emailTaken){
            const newOtp = this.generateOtp();
            user.emailOtp = newOtp
            const newUser = await this.userModel.create(user)
            response['statusCode'] = 200
            response['message'] = 'Registration Succesfull, OTP has been sent to your email.'

            return response
        }
        
        response['statusCode'] = 409
        response['message'] = 'Email already taken.'

        return response


        
    }

    async verifyEmailService(userEmail: number, otp: number){

        const userObj = await this.userModel.findOne({ email: userEmail}).exec();
        const response = {}
        if(otp == userObj.emailOtp){
            userObj.status = 'email verified'
            userObj.save()  
            response['statusCode'] = 200
            response['message'] = 'otp verified'
            return response
        }
        response['statusCode'] = 400
        response['message'] = 'otp verification failed'
        return response

    }
}
