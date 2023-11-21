import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../Schema/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignupService } from '../signup/signup.service';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class LoginService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private signupService: SignupService
    ) { }


    async userLogin(userCredentials: LoginDto) {
        const userObj = await this.userModel.findOne({ email: userCredentials.email }).exec();
        const response = {}

        if (!!userObj) {

            const password = userCredentials.password
            const isPasswordVerified = bcrypt.compareSync(password, userObj.password)
            console.log(isPasswordVerified);
            
            if (isPasswordVerified) {

                if (userObj.status == 'email verified') {
                    response['statusCode'] = 201
                    response['name'] = userObj.name


                    response['token'] = userObj._id
                    return response
                }

                else {
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
            }

            else {
                response['statusCode'] = 405
                response['message'] = 'Password Incorrect'
                return response
            }





        } 
        else {

            console.log('here');
            response['statusCode'] = 404
            response['message'] = 'Email not found'
            return response


        }

    }
}
