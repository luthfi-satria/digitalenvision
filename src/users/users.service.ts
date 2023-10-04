import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import {
  IResponse,
  UserServiceInterface,
} from './interface/user.service.interface';

@Injectable()
export class UsersService implements UserServiceInterface {
  async register(data: UserDto): Promise<IResponse> {
    try {
      const response: IResponse = {
        success: true,
        message: 'success',
        data: data,
      };
      return response;
    } catch (err) {
      Logger.log('[ERROR] Register => ', err);
      throw err;
    }
  }

  async update(id: number, data: UserDto): Promise<IResponse> {
    try {
      const response: IResponse = {
        success: true,
        message: 'success',
        data: data,
      };
      return response;
    } catch (err) {
      Logger.log('[ERROR] Update => ', err);
      throw err;
    }
  }

  async delete(id: number): Promise<IResponse> {
    try {
      const response: IResponse = {
        success: true,
        message: 'success',
        data: {
          id: id,
        },
      };
      return response;
    } catch (err) {
      Logger.log('[ERROR] Delete => ', err);
      throw err;
    }
  }

  async sendMail(data: any): Promise<any> {
    try {
      // send to https://email-service.digitalenvision.com.au/send-email
      return data;
    } catch (err) {
      Logger.log('[ERROR] sendMail => ', err);
      throw err;
    }
  }
}
