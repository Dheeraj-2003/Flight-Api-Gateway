
import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Res, Get, Query, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ROLE } from 'src/common/role.enum';
  
@Controller('flight')
@UseGuards(JwtAuthGuard)
export class FlightGatewayController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private flightServiceBaseUrl = this.configService.get<string>('FLIGHT_SERVICE_URL');
    private flightServiceUrl = `${this.flightServiceBaseUrl}/api`;

  @Post()
  @UseGuards(new RoleGuard(ROLE.ADMIN))
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
  @UseGuards(new RoleGuard(ROLE.ADMIN))
  @HttpCode(HttpStatus.OK)
  async deleteFlightById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const result = await firstValueFrom(
      this.httpService.delete(`${this.flightServiceUrl}/flight/${id}`, { validateStatus: () => true })
    );
    res.status(result.status).json(result.data);
  }

  @Patch(':id/seats')
  @UseGuards(new RoleGuard(ROLE.ADMIN))
  async updateSeats(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Res() res: Response) {
    const result = await firstValueFrom(
      this.httpService.patch(`${this.flightServiceUrl}/flight/${id}/seats`, body, { validateStatus: () => true })
    );
    res.status(result.status).json(result.data);
  }
}
