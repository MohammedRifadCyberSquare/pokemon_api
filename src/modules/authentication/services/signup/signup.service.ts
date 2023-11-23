import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../../Schema/user.schema';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../../dto/user.dto';


@Injectable()
export class SignupService {

    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService,
         
    ) { }



 
    generateOtp() {
        const min = 10000;
        const max = 99999;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async isEmailExist(email: string) {
        const user = await this.userModel.findOne({ email }).exec();
        return !!user
    }

    async userSignup(user: AuthDto) {

        const response = {}
        const emailTaken = await this.isEmailExist(user.email)
        if (!emailTaken) {
            const newOtp = this.generateOtp();
            user.emailOtp = newOtp
            user.password = bcrypt.hashSync(user.password,10)
            user.status = 'email verification pending'
            const newUser = await this.userModel.create(user)
            console.log(newUser.email,'pppppppppppppppppppp');
            
            const tokens = await this.getTokens(newUser._id, newUser.email);
            await this.updateRefreshToken(newUser.id, tokens.refreshToken)
            console.log(user.password)
            response['statusCode'] = 201
            response['email'] = user.email

            response['message'] = 'Registration Succesfull, OTP has been sent to your email.'
            response['generatedOtp'] = newOtp
            return response
        }

        response['statusCode'] = 409
        response['message'] = 'Email already taken.'

        return response



    }

    async verifyEmailService(userEmail: number, otp: number) {

        const userObj = await this.userModel.findOne({ email: userEmail }).exec();
        const response = {}
        console.log(userObj.emailOtp,'000000000000');
        if (otp == userObj.emailOtp) {
            console.log('match');

            userObj.status = 'email verified'
            userObj.save()
            response['statusCode'] = 200
            response['message'] = 'otp verified'
          
            return response
        }
        else {
            console.log('nomatch');
            response['statusCode'] = 404
            response['message'] = 'otp verification failed'
            return response
        }


    }

    async resendOtpService(email: String){
        console.log('******************', email);
        
        const userObj = await this.userModel.findOne({ email: email }).exec();
        const newOtp = this.generateOtp()
 
        userObj.emailOtp = newOtp
        userObj.save();
        return {'statusCode': 200, 'mesage': 'Otp Sent'}


    }

    async getTokens(userId: any, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
            //   secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            secret: 'secret@access',
              expiresIn: '10h',
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
            secret: 'secret@refresh',

            //   secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
              expiresIn: '7d',
            },
          ),
        ]);
    
        return {
          accessToken,
          refreshToken,
        };
      }

      async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hashSync(refreshToken, 10);
        console.log('here', hashedRefreshToken);
        // const userObj = await this.userModel.findOne({ _id: userId }).exec();
         
        try {
          // await this.userModel.updateOne({_id: userId }, {$set: { refreshToken: hashedRefreshToken, } }, { new: true } )
          await this.userModel.updateOne(
            { _id: userId },
            { $set: { refreshToken: hashedRefreshToken } }
          );
          console.log('Refresh token updated successfully.');
        } catch (error) {
          console.error('Error updating refresh token:', error.message);
          // Handle the error appropriately
        }
        
        
        
        // await this.userModel.update(userId, {
        //   refreshToken: hashedRefreshToken,
        // });
      }
}
