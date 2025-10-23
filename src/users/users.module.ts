// // // src/users/users.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity/user.entity';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   providers: [UsersService],
//   controllers: [UsersController],
//   exports: [UsersService],
// })
// export class UsersModule {}



// // // src/users/users.module.ts

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { MulterModule } from '@nestjs/platform-express';
// import { User } from './entities/user.entity/user.entity';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]),
//     MulterModule.register({
//       dest: './Uploads',
//     }),
//   ],
//   providers: [UsersService],
//   controllers: [UsersController],
//   exports: [UsersService],
// })
// export class UsersModule {}



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { User } from './entities/user.entity/user.entity';
import { Professional } from '../professionals/entities/professional.entity/professional.entity';
import { Appointment } from '../appointments/entities/appointment.entity/appointment.entity';
import { Review } from './entities/review.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Professional, Appointment, Review]),
    AppointmentsModule,
    MulterModule.register({
      dest: './Uploads',
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
