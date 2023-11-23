import { Controller, Body, Post, Req, UseGuards  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request} from 'express';
import { LogoutService } from '../services/logout/logout.service';
import { AccessTokenGuard } from '../guards/access-token-guard/access-token-guard.guard';
@Controller('logout')
export class LogoutController {

    constructor(private logoutService: LogoutService){}

    @Post()
    @UseGuards(AccessTokenGuard)
    async logoutUser(@Req() req: Request){
        const user = req['user'].sub
        return this.logoutService.logout(user)
    }
}
