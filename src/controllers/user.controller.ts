
import { Controller, Inject, Get, UseGuards, Param, Request,ParseIntPipe, Post, Body, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { USER_SERVICE } from 'src/common/constants';
import { ROLE } from 'src/common/role.enum';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { RoleGuard } from 'src/guards/role.guard';
  
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  @UseGuards(new RoleGuard(ROLE.ADMIN))
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
    return this.client.send({ cmd: 'get-user' }, {id: id});
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
