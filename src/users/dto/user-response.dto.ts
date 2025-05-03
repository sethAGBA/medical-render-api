import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto: string;
  address: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
  role: string;

  @Exclude()
  password: string;
}