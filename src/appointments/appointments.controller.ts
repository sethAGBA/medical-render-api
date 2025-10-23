import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

interface RequestWithUser extends ExpressRequest {
  user: {
    id: string;
    role: string;
  };
}

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateAppointmentDto, @Req() req: RequestWithUser) {
    return this.appointmentsService.createAppointment(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'professional')) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce rendez-vous');
    }
    return this.appointmentsService.updateAppointment(id, dto);
  }
}
