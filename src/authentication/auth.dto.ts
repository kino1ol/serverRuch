import { Length, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @Length(3,15,{ message: 'validation.Length' })
  domain: string
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @Length(3,36, { message: 'validation.Length' })
  password: string
}