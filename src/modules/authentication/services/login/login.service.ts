import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../Schema/user.schema';
import mongoose from 'mongoose';
import { SignupService } from '../signup/signup.service';

@Injectable()
export class LoginService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private signupService: SignupService
    ) { }


   async userLogin(userCredentials: User){
        const userObj = await this.userModel.findOne({ email: userCredentials.email, password: userCredentials.password }).exec();
        const response = {}
         
        if(!!userObj){
           
            if(userObj.status == 'email verified'){
                response['statusCode'] = 201
                response['name'] = userObj.name
                
                response['token'] = userObj._id
                return response
            }
            
            response['statusCode'] = 502
            response['email'] = userObj.email
            const newOtp = this.signupService.generateOtp()
            userObj.emailOtp = newOtp
            userObj.save()
            console.log('pending');
            
            response['message'] = 'Email not verified'
            console.log(response);
            return response
           
        }
        console.log(response);
        response['statusCode'] = 404
        response['message'] = 'User name or password incorrect'
        return response
        

    }
}
