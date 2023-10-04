import { UserDto } from '../dto/users.dto';

export interface IResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data?: Record<string, any>;
  readonly error?: string[];
}

export interface UserServiceInterface {
  register(data: UserDto): Promise<IResponse>;
  update(id: number, data: UserDto): Promise<IResponse>;
  delete(id: number): Promise<IResponse>;
  sendMail(data: any): Promise<any>;
}
