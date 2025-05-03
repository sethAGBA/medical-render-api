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



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { User } from './entities/user.entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      dest: './Uploads',
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}