import { Body, Controller, Param, Post, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';

@Controller('api/user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('')
  async register(@Body() payload: UserDto) {
    return this.userService.register(payload);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UserDto) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
