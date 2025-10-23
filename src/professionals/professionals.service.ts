// //src/professionals/professionals.service.ts
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ProfessionalsService {}

// // src/professionals/professionals.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Professional } from './entities/professional.entity/professional.entity';
// import { CreateProfessionalDto } from './dto/create-professional.dto';
// import { UpdateProfessionalDto } from './dto/update-professional.dto';
// import { User } from '../users/entities/user.entity/user.entity';

// @Injectable()
// export class ProfessionalsService {
//   constructor(
//     @InjectRepository(Professional)
//     private professionalRepository: Repository<Professional>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async findAll(): Promise<Professional[]> {
//     return this.professionalRepository.find({ relations: ['user', 'appointments'] });
//   }

//   async findOne(id: string): Promise<Professional> {
//     const professional = await this.professionalRepository.findOne({
//       where: { id },
//       relations: ['user', 'appointments'],
//     });
//     if (!professional) {
//       throw new NotFoundException(`Professional #${id} not found`);
//     }
//     return professional;
//   }

//   async findByUser(userId: string): Promise<Professional | null> {
//     const professional = await this.professionalRepository.findOne({
//       where: { userId },
//       relations: ['user', 'appointments'],
//     });
//     return professional || null;
//   }

//   async create(createProfessionalDto: CreateProfessionalDto): Promise<Professional> {
//     const professional = this.professionalRepository.create(createProfessionalDto);
//     return this.professionalRepository.save(professional);
//   }

//   async update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<Professional> {
//     const professional = await this.findOne(id);
//     const { fullName, profilePhoto, phoneNumber, address, ...professionalData } = updateProfessionalDto;

//     // Update Professional entity
//     this.professionalRepository.merge(professional, professionalData);

//     // Update User entity if provided
//     if (fullName || profilePhoto || phoneNumber || address) {
//       const user = await this.userRepository.findOne({ where: { id: professional.userId } });
//       if (!user) {
//         throw new NotFoundException(`User #${professional.userId} not found`);
//       }
//       this.userRepository.merge(user, { fullName, profilePhoto, phoneNumber, address });
//       await this.userRepository.save(user);
//     }

//     return this.professionalRepository.save(professional);
//   }

//   async remove(id: string): Promise<void> {
//     const professional = await this.findOne(id);
//     await this.professionalRepository.remove(professional);
//   }
// }




import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity/professional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { User } from '../users/entities/user.entity/user.entity';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Professional[]> {
    return this.professionalRepository.find({ relations: ['user', 'appointments'] });
  }

  async findOne(id: string): Promise<Professional> {
    const professional = await this.professionalRepository.findOne({
      where: { id },
      relations: ['user', 'appointments'],
    });
    if (!professional) {
      throw new NotFoundException(`Professional #${id} not found`);
    }
    return professional;
  }

  async findByUser(userId: string): Promise<any> {
    const professional = await this.professionalRepository.findOne({
      where: { userId },
      select: ['id', 'specialty', 'about', 'location', 'availabilities', 'consultationPrices', 'createdAt', 'userId'],
      relations: ['user'],
    });
    if (!professional) {
      return null;
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'fullName',
        'email',
        'phoneNumber',
        'dateOfBirth',
        'gender',
        'profilePhoto',
        'address',
        'bloodType',
        'allergies',
        'emergencyContact',
        'role',
      ],
    });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return {
      ...user,
      specialty: professional.specialty,
      about: professional.about,
      location: professional.location,
      availabilities: professional.availabilities,
      consultationPrices: professional.consultationPrices,
      createdAt: professional.createdAt,
    };
  }

  async create(createProfessionalDto: CreateProfessionalDto): Promise<Professional> {
    const professional = this.professionalRepository.create(createProfessionalDto);
    return this.professionalRepository.save(professional);
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<any> {
    const professional = await this.findOne(id);
    const { fullName, profilePhoto, phoneNumber, address, ...professionalData } = updateProfessionalDto;

    // Update Professional entity
    this.professionalRepository.merge(professional, professionalData);

    // Update User entity if provided
    if (fullName || profilePhoto || phoneNumber || address) {
      const user = await this.userRepository.findOne({ where: { id: professional.userId } });
      if (!user) {
        throw new NotFoundException(`User #${professional.userId} not found`);
      }
      this.userRepository.merge(user, {
        ...(fullName !== null ? { fullName } : {}),
        ...(profilePhoto !== null ? { profilePhoto } : {}),
        ...(phoneNumber !== null ? { phoneNumber } : {}),
        ...(address !== null ? { address } : {}),
      });
      await this.userRepository.save(user);
    }

    await this.professionalRepository.save(professional);

    // Return combined data
    const user = await this.userRepository.findOne({
      where: { id: professional.userId },
      select: [
        'id',
        'fullName',
        'email',
        'phoneNumber',
        'dateOfBirth',
        'gender',
        'profilePhoto',
        'address',
        'bloodType',
        'allergies',
        'emergencyContact',
        'role',
      ],
    });
    return {
      ...user,
      specialty: professional.specialty,
      about: professional.about,
      location: professional.location,
      availabilities: professional.availabilities,
      consultationPrices: professional.consultationPrices,
      createdAt: professional.createdAt,
    };
  }

  async remove(id: string): Promise<void> {
    const professional = await this.findOne(id);
    await this.professionalRepository.remove(professional);
  }
}