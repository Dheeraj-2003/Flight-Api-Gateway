import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
    Res,
    ParseIntPipe
  } from '@nestjs/common';
  import { HttpService } from '@nestjs/axios';
  import { firstValueFrom } from 'rxjs';
  import { Response } from 'express';
  import { ConfigService } from '@nestjs/config';
  
  @Controller('flight')
  export class FlightGatewayController {
    constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService
    ) {}
  
    private flightServiceUrl = this.configService.get<string>('FLIGHT_SERVICE_URL');
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createFlight(@Body() body: any, @Res() res: Response) {
      const result = await firstValueFrom(
        this.httpService.post(`${this.flightServiceUrl}/flight`, body, { validateStatus: () => true })
      );
      res.status(result.status).json(result.data);
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllFlights(@Query() query: any, @Res() res: Response) {
      const result = await firstValueFrom(
        this.httpService.get(`${this.flightServiceUrl}/flight`, { params: query, validateStatus: () => true })
      );
      res.status(result.status).json(result.data);
    }
  
    @Get(':id')
    async getFlightById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
      const result = await firstValueFrom(
        this.httpService.get(`${this.flightServiceUrl}/flight/${id}`, { validateStatus: () => true })
      );
      res.status(result.status).json(result.data);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteFlightById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
      const result = await firstValueFrom(
        this.httpService.delete(`${this.flightServiceUrl}/flight/${id}`, { validateStatus: () => true })
      );
      res.status(result.status).json(result.data);
    }
  
    @Patch(':id/seats')
    async updateSeats(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Res() res: Response) {
      const result = await firstValueFrom(
        this.httpService.patch(`${this.flightServiceUrl}/flight/${id}/seats`, body, { validateStatus: () => true })
      );
      res.status(result.status).json(result.data);
    }
  }
  