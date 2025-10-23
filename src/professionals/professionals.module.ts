// //src/professionals/professionals.module.ts
// import { Module } from '@nestjs/common';
// import { ProfessionalsService } from './professionals.service';
// import { ProfessionalsController } from './professionals.controller';

// @Module({
//   providers: [ProfessionalsService],
//   controllers: [ProfessionalsController]
// })
// export class ProfessionalsModule {}


// src/professionals/professionals.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';
import { Professional } from './entities/professional.entity/professional.entity';
import { User } from '../users/entities/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, User])],
  providers: [ProfessionalsService],
  controllers: [ProfessionalsController],
})
export class ProfessionalsModule {}