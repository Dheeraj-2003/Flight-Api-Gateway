import {Controller,Post,Body,Headers,HttpCode,HttpStatus,Req,Res,All,} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
  
@Controller('booking')
export class BookingGatewayController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    private bookingServiceUrl = this.configService.get<string>('BOOKING_SERVICE_URL');

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async forwardCreateBooking(@Body() body: any, @Res() res: Response) {
        const result = await firstValueFrom(
        this.httpService.post(`${this.bookingServiceUrl}/booking`, body, { validateStatus: () => true })
        );
        res.status(result.status).json(result.data);
    }

    @Post('/payment')
    @HttpCode(HttpStatus.OK)
    async forwardPayment(
        @Body() body: any,
        @Headers('x-idempotent-key') key: string,
        @Res() res: Response
    ) {
        const result = await firstValueFrom(
        this.httpService.post(`${this.bookingServiceUrl}/booking/payment`, body, {
            headers: {
            'x-idempotent-key': key,
            },
            validateStatus: () => true
        })
        );
        res.status(result.status).json(result.data);
    }
}
  