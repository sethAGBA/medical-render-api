// src/appointments/dto/update-appointment.dto.ts
import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['available', 'booked', 'cancelled', 'completed'])
  status?: AppointmentStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
