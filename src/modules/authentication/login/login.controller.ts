import { Controller, Body, Post } from '@nestjs/common';
import { LoginService } from '../services/login/login.service';
import { LoginDto } from '../dto/login.dto';

@Controller('login')
export class LoginController {

    constructor(private loginService: LoginService) { }

    @Post()
    async createUSer(@Body() userCredentials: LoginDto) {
console.log(userCredentials);

        return this.loginService.userLogin(userCredentials)
    }
}
