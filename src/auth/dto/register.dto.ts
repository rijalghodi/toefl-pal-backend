import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;

export class RegisterDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @MaxLength(255, { message: 'Name must less than 255 characters.' })
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message:
      'Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
