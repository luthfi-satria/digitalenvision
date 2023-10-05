import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import {
  IResponse,
  UserServiceInterface,
} from './interface/user.service.interface';
import { AccountDocuments } from './entities/users.entities';
import { capitalizeText } from './../utility/textconverter.utility';
import * as fs from 'fs';
import { join } from 'path';
import { HttpService } from '@nestjs/axios';
import { map, catchError, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService implements UserServiceInterface {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(AccountDocuments)
    private readonly userRepo: Repository<AccountDocuments>,
  ) {}

  async detail(id: number): Promise<IResponse> {
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
      Logger.log('[ERROR] Detail => ', err);
      throw err;
    }
  }

  async register(data: UserDto): Promise<IResponse> {
    try {
      // ASSIGN INPUT DATA TO VARIABLE
      const insertData: Partial<AccountDocuments> = {
        firstName: capitalizeText(data?.firstName),
        lastName: capitalizeText(data?.lastName),
        area: capitalizeText(data?.area),
        country: capitalizeText(data?.country),
        region: capitalizeText(data?.region),
        dob: new Date(data?.dob),
        address: data?.address,
      };

      // FILTER TIMEZONE WITH AVAILABLE TIMEZONE FROM WORLD TIMEZONE
      const findTimezone = await this.readTimezone([
        `${insertData.area}/${insertData.country}/${insertData.region}`,
        `${insertData.area}/${insertData.region}`,
      ]);

      // IF THERE IS NO AVAILABLE TIMEZONE THEN RETURN FAILED
      if (findTimezone.length == 0) {
        const responseFailed: IResponse = {
          success: false,
          message: 'Invalid area and region',
          data: [],
        };
        return responseFailed;
      }

      // GETTING GMT OFFSET FOR USER LOCATION
      const getGmtTime = await this.worldTimeApi(findTimezone[0]);
      insertData.gmtOffset = getGmtTime;

      // INSERT USER DATA INTO DATABASE
      const result = await this.userRepo.save(insertData).catch((err) => {
        throw new ForbiddenException(err);
      });

      const response: IResponse = {
        success: true,
        message: 'success',
        data: result,
      };

      return response;
    } catch (err) {
      Logger.log('[ERROR] Register => ', err);
      throw err;
    }
  }

  async update(id: number, data: UserDto): Promise<IResponse> {
    try {
        // FIND EXISTING USER
      const findUser = await this.userRepo.findOneBy({ id: id });

      // IF FOUND THEN REPLACE THE EXISTING ONE WITH INPUT DATA
      if (findUser) {
        const update: Partial<AccountDocuments> = {
          ...findUser,
          firstName: capitalizeText(data?.firstName),
          lastName: capitalizeText(data?.lastName),
          area: capitalizeText(data?.area),
          country: capitalizeText(data?.country),
          region: capitalizeText(data?.region),
          dob: new Date(data?.dob),
          address: data?.address,
        };

        // SEARCH AVAILABLE TIMEZONE
        const findTimezone = await this.readTimezone([
          `${update.area}/${update.country}/${update.region}`,
          `${update.area}/${update.region}`,
        ]);

        // IF AVAILABLE TIMEZONE IS NOT EXISTS THEN RETURN FAILED
        if (findTimezone.length == 0) {
          const responseFailed: IResponse = {
            success: false,
            message: 'Invalid area and region',
            data: [],
          };
          return responseFailed;
        }

        // GETTING GMT OFFSET FROM WORLD TIME API
        const getGmtTime = await this.worldTimeApi(findTimezone[0]);
        update.gmtOffset = getGmtTime;

        // UPDATE THE DATA
        const result = await this.userRepo.save(update).catch((err) => {
          throw new ForbiddenException(err);
        });

        const response: IResponse = {
          success: true,
          message: 'user successfully updated',
          data: result,
        };

        return response;
      }
      return {
        success: false,
        message: 'User not found',
        data: [],
      } as IResponse;
    } catch (err) {
      Logger.log('[ERROR] Update => ', err);
      throw err;
    }
  }

  async delete(id: number): Promise<IResponse> {
    try {
      const findUser = await this.userRepo.findOneBy({ id: id });
      if (findUser) {
        const deleteData = await this.userRepo
          .delete({ id: id })
          .catch((err) => {
            throw new ForbiddenException(err);
          });

        const response: IResponse = {
          success: true,
          message: 'success',
          data: deleteData,
        };
        return response;
      }
      return {
        success: false,
        message: 'User is not found',
        data: [],
      } as IResponse;
    } catch (err) {
      Logger.log('[ERROR] Delete => ', err);
      throw err;
    }
  }

  async readTimezone(data: any): Promise<any> {
    try {
      const timezone = fs.readFileSync(
        join(process.cwd(), 'src/database/timezone/timezone.json'),
        'utf-8',
      );
      const parseTimezone = JSON.parse(timezone);
      if (data) {
        const findTimezone = data.map((items) => {
          return parseTimezone.find((element) => {
            return element == items;
          });
        });
        return findTimezone ? findTimezone.filter((e) => e != null) : [];
      }
      return '';
    } catch (error) {
      Logger.log('[ERROR] READ TIMEZONE => ', error);
      throw error;
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

  async worldTimeApi(timezone: string): Promise<any> {
    try {
      const axios = this.httpService
        .get('http://worldtimeapi.org/api/timezone/' + timezone)
        .pipe(
          map((res) => {
            return res?.data?.utc_offset;
          }),
        )
        .pipe(
          catchError(() => {
            throw new ForbiddenException('Api is not available');
          }),
        );
      return await lastValueFrom(axios);
    } catch (error) {
      Logger.log('[ERROR] WORLD TIME API =>', error);
    }
  }
}
