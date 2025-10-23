// // src/appointments/appointments.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Appointment } from '../appointments/entities/appointment.entity/appointment.entity';
// import { AppointmentsService } from './appointments.service';
// import { AppointmentsController } from './appointments.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([Appointment])], // Importez l'entité Appointment
//   providers: [AppointmentsService],
//   controllers: [AppointmentsController],
//   exports: [AppointmentsService], // Exportez le service pour l'utiliser ailleurs
// })
// export class AppointmentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity/appointment.entity';
import { User } from '../users/entities/user.entity/user.entity';
import { Professional } from '../professionals/entities/professional.entity/professional.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Professional]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
