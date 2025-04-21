import {Controller, Post, Body, Headers, HttpCode, HttpStatus, Req, Res, All,  UseGuards, Request} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
  
@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingGatewayController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    private bookingServiceBaseUrl = this.configService.get<string>('BOOKING_SERVICE_URL');
    private bookingServiceUrl = `${this.bookingServiceBaseUrl}/api`;

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async forwardCreateBooking(@Body() body: any, @Res() res: Response, @Request() req) {
        const result = await firstValueFrom(
        this.httpService.post(`${this.bookingServiceUrl}/booking`, {
            "userId": req.user.userId,
            ...body
        }, { validateStatus: () => true })
        );
        res.status(result.status).json(result.data);
    }

    @Post('/payment')
    @HttpCode(HttpStatus.OK)
    async forwardPayment(
        @Body() body: any,
        @Headers('x-idempotent-key') key: string,
        @Request() req,
        @Res() res: Response
    ) {
        const result = await firstValueFrom(
        this.httpService.post(`${this.bookingServiceUrl}/booking/payment`,  {
            "userId": req.user.userId,
            ...body
        }, {
            headers: {
            'x-idempotent-key': key,
            },
            validateStatus: () => true
        })
        );
        res.status(result.status).json(result.data);
    }
}
  