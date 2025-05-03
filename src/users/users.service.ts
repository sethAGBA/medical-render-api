// // src/users/users.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity/user.entity';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async create(user: Partial<User>): Promise<User> {
//     return this.usersRepository.save(user);
//   }

//   async findOneByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
//     const user = await this.usersRepository.findOne({
//       where: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
//     });
//     return user ?? undefined;
//   }

//   async findAll(): Promise<User[]> {
//     return this.usersRepository.find();
//   }

//   async delete(id: string): Promise<void> {
//     await this.usersRepository.delete(id);
//   }
// }




// // src/users/users.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity/user.entity';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async create(user: Partial<User>): Promise<User> {
//     return this.usersRepository.save(user);
//   }

//   async findOneByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
//     const user = await this.usersRepository.findOne({
//       where: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
//     });
//     return user ?? undefined;
//   }

//   async findOneById(id: string): Promise<User> {
//     const user = await this.usersRepository.findOne({ where: { id } });
//     if (!user) {
//       throw new Error('User not found');
//     }
//     return user;
//   }

//   async findAll(): Promise<User[]> {
//     return this.usersRepository.find();
//   }

//   async delete(id: string): Promise<void> {
//     await this.usersRepository.delete(id);
//   }
// }


// // src/users/users.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async findAll(): Promise<User[]> {
//     return this.usersRepository.find();
//   }

//   async findOneById(id: string): Promise<User> {
//     const user = await this.usersRepository.findOne({ where: { id } });
//     if (!user) {
//       throw new NotFoundException('Utilisateur non trouvé');
//     }
//     return user;
//   }

//   async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
//     const user = await this.findOneById(id);
//     Object.assign(user, updateUserDto);
//     return this.usersRepository.save(user);
//   }

//   async delete(id: string): Promise<void> {
//     const result = await this.usersRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException('Utilisateur non trouvé');
//     }
//   }
// }


// // src/users/users.service.ts


// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}

//   async findAll(): Promise<User[]> {
//     return this.usersRepository.find();
//   }

//   async findOneById(id: string): Promise<User> {
//     const user = await this.usersRepository.findOne({ where: { id } });
//     if (!user) {
//       throw new NotFoundException('Utilisateur non trouvé');
//     }
//     return user;
//   }

//   async findOneByEmail(email: string): Promise<User | null> {
//     return this.usersRepository.findOne({ where: { email } });
//   }

//   async findOneByPhoneNumber(phoneNumber: string): Promise<User | null> {
//     return this.usersRepository.findOne({ where: { phoneNumber } });
//   }

//   async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
//     const user = await this.findOneById(id);
//     if (Object.keys(updateUserDto).length === 0) {
//       return user; // No changes to apply
//     }
//     // Validate uniqueness of email and phoneNumber if provided
//     if (updateUserDto.email && updateUserDto.email !== user.email) {
//       const existingEmail = await this.findOneByEmail(updateUserDto.email);
//       if (existingEmail && existingEmail.id !== id) {
//         throw new NotFoundException('Cet email est déjà utilisé');
//       }
//     }
//     if (updateUserDto.phoneNumber && updateUserDto.phoneNumber !== user.phoneNumber) {
//       const existingPhone = await this.findOneByPhoneNumber(updateUserDto.phoneNumber);
//       if (existingPhone && existingPhone.id !== id) {
//         throw new NotFoundException('Ce numéro de téléphone est déjà utilisé');
//       }
//     }
//     Object.assign(user, updateUserDto);
//     return this.usersRepository.save(user);
//   }

//   async delete(id: string): Promise<void> {
//     const result = await this.usersRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException('Utilisateur non trouvé');
//     }
//   }
// }


import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
  }

  // Méthodes de base CRUD
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create({
      ...user,
      profilePhoto: 'https://via.placeholder.com/150'
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  // Méthodes de recherche spécifiques
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phoneNumber } });
  }

  async findOneByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });
    return user ?? undefined;
  }

  // Méthodes de mise à jour
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    
    if (Object.keys(updateUserDto).length === 0) {
      return user;
    }

    await this.validateUniqueFields(id, updateUserDto);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  private async validateUniqueFields(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.email) {
      const existingEmail = await this.findOneByEmail(updateUserDto.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }
    }

    if (updateUserDto.phoneNumber) {
      const existingPhone = await this.findOneByPhoneNumber(updateUserDto.phoneNumber);
      if (existingPhone && existingPhone.id !== id) {
        throw new BadRequestException('Ce numéro de téléphone est déjà utilisé');
      }
    }
  }

  // Méthodes de gestion des photos de profil
  async uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<string> {
    if (!file?.buffer) {
      throw new BadRequestException('Fichier invalide');
    }

    const user = await this.findOneById(userId);
    await this.deleteProfilePhotoFile(user.profilePhoto);
    
    await fs.mkdir(this.uploadDir, { recursive: true });
    const fileName = this.generatePhotoFileName(userId, file);
    const filePath = path.join(this.uploadDir, fileName);
    
    await fs.writeFile(filePath, file.buffer);
    
    const photoUrl = this.generatePhotoUrl(fileName);
    await this.update(userId, { profilePhoto: photoUrl });
    
    return photoUrl;
  }

  async deleteProfilePhoto(userId: string): Promise<void> {
    const user = await this.findOneById(userId);
    await this.deleteProfilePhotoFile(user.profilePhoto);
    await this.update(userId, {
      profilePhoto: 'https://via.placeholder.com/150'
    });
  }

  private async deleteProfilePhotoFile(photoUrl: string): Promise<void> {
    if (!photoUrl || photoUrl.includes('placeholder')) {
      return;
    }

    try {
      const fileName = photoUrl.split('/').pop();
      if (fileName) {
        const filePath = path.join(this.uploadDir, fileName);
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }

  private generatePhotoFileName(userId: string, file: Express.Multer.File): string {
    return `${userId}-${Date.now()}${path.extname(file.originalname)}`;
  }

  private generatePhotoUrl(fileName: string): string {
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    return `${baseUrl}/uploads/profiles/${fileName}`;
  }

  // Méthode de suppression
  async delete(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await this.deleteProfilePhotoFile(user.profilePhoto);
    
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }
}