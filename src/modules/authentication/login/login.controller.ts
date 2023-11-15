import { Controller, Body, Post } from '@nestjs/common';
import { LoginService } from '../services/login/login.service';

@Controller('login')
export class LoginController {

    constructor(private loginService: LoginService) { }

    @Post()
    async createUSer(@Body() userCredentials) {
console.log(userCredentials);

        return this.loginService.userLogin(userCredentials)
    }
}
