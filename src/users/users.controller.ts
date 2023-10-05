import { Body, Controller, Param, Post, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { faker } from '@faker-js/faker';

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

  @Post('dummy')
  async dummyUser() {
    const timeZone = faker.location.timeZone();
    const timeZoneArray = timeZone.split('/');
    const area = timeZoneArray[0];

    let country = '';
    let region = '';
    if (timeZoneArray.length > 2) {
      country = timeZoneArray[1];
      region = timeZoneArray[2];
    } else {
      country = timeZoneArray[1];
      region = timeZoneArray[1];
    }

    const payload: UserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      area: area,
      country: country,
      region: region,
      dob: faker.date.birthdate().toISOString().split('T')[0],
      address: faker.location.streetAddress(),
    };

    return this.userService.register(payload);
  }
}
