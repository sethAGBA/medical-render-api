// // src/users/users.controller.ts
// import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { User } from './entities/user.entity/user.entity';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get()
//   findAll(): Promise<User[]> {
//     return this.usersService.findAll();
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string): Promise<void> {
//     return this.usersService.delete(id);
//   }
// }

// // src/users/users.controller.ts
// import { Controller, Get, Delete, Param, Request, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { User } from './entities/user.entity/user.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   findAll(): Promise<User[]> {
//     return this.usersService.findAll();
//   }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   getProfile(@Request() req): Promise<User> {
//     return this.usersService.findOneById(req.user.userId);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   delete(@Param('id') id: string): Promise<void> {
//     return this.usersService.delete(id);
//   }
// }


// // src/users/users.controller.ts
// import { Controller, Get, Delete, Patch, Param, Request, Body, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { User } from './entities/user.entity/user.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   findAll(): Promise<User[]> {
//     return this.usersService.findAll();
//   }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   getProfile(@Request() req): Promise<User> {
//     return this.usersService.findOneById(req.user.userId);
//   }

//   @Patch('me')
//   @UseGuards(JwtAuthGuard)
//   updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
//     return this.usersService.update(req.user.userId, updateUserDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   delete(@Param('id') id: string): Promise<void> {
//     return this.usersService.delete(id);
//   }
// }




// src/users/users.controller.ts


// import { Controller, Get, Delete, Patch, Param, Request, Body, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { User } from './entities/user.entity/user.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   findAll(): Promise<User[]> {
//     return this.usersService.findAll();
//   }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   getProfile(@Request() req): Promise<User> {
//     return this.usersService.findOneById(req.user.id);
//   }

//   @Patch('me')
//   @UseGuards(JwtAuthGuard)
//   updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
//     return this.usersService.update(req.user.id, updateUserDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   delete(@Param('id') id: string): Promise<void> {
//     return this.usersService.delete(id);
//   }
// }



// // src/users/users.controller.ts
// import { 
//   Controller, 
//   Get, 
//   Post,
//   Delete, 
//   Patch, 
//   Param, 
//   Request, 
//   Body, 
//   UseGuards,
//   UseInterceptors,
//   UploadedFile 
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';
// import { extname } from 'path';
// import { Request as ExpressRequest } from 'express';
// import { UsersService } from './users.service';
// import { User } from './entities/user.entity/user.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UpdateUserDto } from './dto/update-user.dto';

// // Interface pour la requête authentifiée
// interface RequestWithUser extends ExpressRequest {
//   user: {
//     id: string;
//     email: string;
//     role: string;
//   };
// }

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   // Endpoints pour tous les utilisateurs
//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   getProfile(@Request() req: RequestWithUser): Promise<User> {
//     return this.usersService.findOneById(req.user.id);
//   }

//   @Patch('me')
//   @UseGuards(JwtAuthGuard)
//   updateProfile(
//     @Request() req: RequestWithUser,
//     @Body() updateUserDto: UpdateUserDto
//   ): Promise<User> {
//     return this.usersService.update(req.user.id, updateUserDto);
//   }

//   @Post('profile-photo')
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(FileInterceptor('photo', {
//     storage: memoryStorage(),
//     fileFilter: (req, file, callback) => {
//       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//         return callback(new Error('Seuls les fichiers JPG et PNG sont autorisés!'), false);
//       }
//       callback(null, true);
//     },
//     limits: {
//       fileSize: 5 * 1024 * 1024 // 5MB max
//     }
//   }))
//   async uploadProfilePhoto(
//     @Request() req: RequestWithUser,
//     @UploadedFile() file: Express.Multer.File,
//   ): Promise<{ photoUrl: string }> {
//     if (!file) {
//       throw new Error('Aucun fichier n\'a été uploadé');
//     }
//     const photoUrl = await this.usersService.uploadProfilePhoto(req.user.id, file);
//     return { photoUrl };
//   }

//   @Delete('me/profile-photo')
//   @UseGuards(JwtAuthGuard)
//   async deleteProfilePhoto(@Request() req: RequestWithUser): Promise<void> {
//     await this.usersService.deleteProfilePhoto(req.user.id);
//   }

//   // Endpoints réservés aux administrateurs
//   @Get()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   findAll(): Promise<User[]> {
//     return this.usersService.findAll();
//   }

//   @Get(':id')
//   @UseGuards(JwtAuthGuard)
//   findOne(@Param('id') id: string): Promise<User> {
//     return this.usersService.findOneById(id);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   update(
//     @Param('id') id: string,
//     @Body() updateUserDto: UpdateUserDto
//   ): Promise<User> {
//     return this.usersService.update(id, updateUserDto);
//   }

//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin')
//   delete(@Param('id') id: string): Promise<void> {
//     return this.usersService.delete(id);
//   }
// }




// src/users/users.controller.ts

import { 
  Controller, 
  Get, 
  Post,
  Put,
  Delete, 
  Patch, 
  Param, 
  Request, 
  Body, 
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfessionalDto } from '../professionals/dto/update-professional.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// Interface pour la requête authentifiée
interface RequestWithUser extends ExpressRequest {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoints pour tous les utilisateurs
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOneById(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProfessionalProfile(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
    @Request() req: RequestWithUser,
  ) {
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to update this profile');
    }
    return this.usersService.updateProfessionalProfile(id, updateProfessionalDto);
  }

  @Post('profile-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Seuls les fichiers JPG et PNG sont autorisés!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB max
    }
  }))
  async uploadProfilePhoto(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ photoUrl: string }> {
    if (!file) {
      throw new Error('Aucun fichier n\'a été uploadé');
    }
    const photoUrl = await this.usersService.uploadProfilePhoto(req.user.id, file);
    return { photoUrl };
  }

  @Delete('me/profile-photo')
  @UseGuards(JwtAuthGuard)
  async deleteProfilePhoto(@Request() req: RequestWithUser): Promise<void> {
    await this.usersService.deleteProfilePhoto(req.user.id);
  }

  // Endpoints réservés aux administrateurs
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}