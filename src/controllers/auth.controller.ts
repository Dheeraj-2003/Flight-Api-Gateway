import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "src/common/constants";

@Controller('auth')
export class AuthController{
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

    @Post('register')
    register(@Body() registerDto: any) {
        const response = this.authClient.send({ cmd: 'register' }, registerDto);
        return response
    }

    @Post('login')
    login(@Body() loginDto:any){
        return this.authClient.send({ cmd: 'login' }, loginDto);
    }
}