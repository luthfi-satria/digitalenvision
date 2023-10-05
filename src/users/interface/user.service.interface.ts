import { UserDto } from '../dto/users.dto';

export interface IResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data?: Record<string, any>;
  readonly error?: string[];
}

export interface UserServiceInterface {
  detail(id: number): Promise<IResponse>;
  register(data: UserDto): Promise<IResponse>;
  update(id: number, data: UserDto): Promise<IResponse>;
  delete(id: number): Promise<IResponse>;
  sendMail(data: any): Promise<any>;
  readTimezone(data: any): Promise<any>;
  worldTimeApi(timezone: string): Promise<any>;
}
