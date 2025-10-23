// // //src/professionals/professionals.controller.ts

// import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { ProfessionalsService } from './professionals.service';
// import { CreateProfessionalDto } from './dto/create-professional.dto';
// import { UpdateProfessionalDto } from './dto/update-professional.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { GetUser } from '../auth/get-user.decorator';
// import { User } from '../users/entities/user.entity/user.entity';

// @Controller('professionals')
// export class ProfessionalsController {
//   constructor(private readonly professionalsService: ProfessionalsService) {}

//   @Get()
//   findAll() {
//     return this.professionalsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.professionalsService.findOne(id);
//   }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   async findByUser(@GetUser() user: User) {
//     const professional = await this.professionalsService.findByUser(user.id);
//     if (!professional) {
//       throw new NotFoundException('No professional profile found for this user');
//     }
//     return professional;
//   }

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   create(@Body() createProfessionalDto: CreateProfessionalDto, @GetUser() user: User) {
//     return this.professionalsService.create({ ...createProfessionalDto, userId: user.id });
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard)
//   async update(
//     @Param('id') id: string,
//     @Body() updateProfessionalDto: UpdateProfessionalDto,
//     @GetUser() user: User,
//   ) {
//     const professional = await this.professionalsService.findOne(id);
//     if (professional.userId !== user.id) {
//       throw new ForbiddenException('You are not authorized to update this profile');
//     }
//     return this.professionalsService.update(id, updateProfessionalDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard)
//   async remove(@Param('id') id: string, @GetUser() user: User) {
//     const professional = await this.professionalsService.findOne(id);
//     if (professional.userId !== user.id) {
//       throw new ForbiddenException('You are not authorized to delete this profile');
//     }
//     return this.professionalsService.remove(id);
//   }
// }





import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity/user.entity';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get()
  findAll() {
    return this.professionalsService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findByUser(@GetUser() user: User) {
    if (user.role !== 'professional') {
      throw new ForbiddenException('Only professionals can access this endpoint');
    }
    const professional = await this.professionalsService.findByUser(user.id);
    if (!professional) {
      throw new NotFoundException('No professional profile found for this user');
    }
    return professional;
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProfessionalDto: CreateProfessionalDto, @GetUser() user: User) {
    if (user.role !== 'professional') {
      throw new ForbiddenException('Only professionals can create a professional profile');
    }
    return this.professionalsService.create({ ...createProfessionalDto, userId: user.id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
    @GetUser() user: User,
  ) {
    const professional = await this.professionalsService.findOne(id);
    if (professional.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to update this profile');
    }
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    const professional = await this.professionalsService.findOne(id);
    if (professional.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to delete this profile');
    }
    return this.professionalsService.remove(id);
  }
}