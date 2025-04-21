
import { Controller, Inject, Get, UseGuards, Param, Request,ParseIntPipe, Post, Body, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { USER_SERVICE } from 'src/common/constants';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
  
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() {
    try {
      const response = this.client.send({ cmd: 'get-all-users' }, {});
      return response;
    } catch (error) {
      console.log(error)
      throw(error)
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'get-user-by-id' }, id);
  }

  @Post()
  async create(@Body() createUserDto: any) {
    try {
      return await  lastValueFrom(this.client.send({ cmd: 'create-user' }, createUserDto)) ;
    } catch (error) {
      console.log(error)
      throw new HttpException(error.message,error.status);
    }
  }
}
