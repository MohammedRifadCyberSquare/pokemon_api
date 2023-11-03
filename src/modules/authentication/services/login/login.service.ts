import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../Schema/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class LoginService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ) { }


   async userLogin(userCredentials: User){
        const user = await this.userModel.findOne({ email: userCredentials.email, password: userCredentials.password }).exec();
        const response = {}
        if(!!user){
            if(user.status == 'email verified'){
                response['statusCode'] = 201
                response['token'] = user._id
                return response
            }
            
            response['statusCode'] = 502
            response['message'] = 'Email not verified'
            return response
           
        }

        response['statusCode'] = 404
        response['message'] = 'User name or password incorrect'
        return response
        

    }
}
