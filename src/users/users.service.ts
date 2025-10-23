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





// // src/users/users.service.ts

// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';
// import * as fs from 'fs/promises';
// import * as path from 'path';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class UsersService {
//   private readonly uploadDir: string;

//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//     private configService: ConfigService,
//   ) {
//     this.uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
//   }

//   // Méthodes de base CRUD
//   async create(user: Partial<User>): Promise<User> {
//     const newUser = this.usersRepository.create({
//       ...user,
//       profilePhoto: 'https://via.placeholder.com/150'
//     });
//     return this.usersRepository.save(newUser);
//   }

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

//   // Méthodes de recherche spécifiques
//   async findOneByEmail(email: string): Promise<User | null> {
//     return this.usersRepository.findOne({ where: { email } });
//   }

//   async findOneByPhoneNumber(phoneNumber: string): Promise<User | null> {
//     return this.usersRepository.findOne({ where: { phoneNumber } });
//   }

//   async findOneByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
//     const user = await this.usersRepository.findOne({
//       where: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
//     });
//     return user ?? undefined;
//   }

//   // Méthodes de mise à jour
//   async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
//     const user = await this.findOneById(id);
    
//     if (Object.keys(updateUserDto).length === 0) {
//       return user;
//     }

//     await this.validateUniqueFields(id, updateUserDto);
//     Object.assign(user, updateUserDto);
//     return this.usersRepository.save(user);
//   }

//   private async validateUniqueFields(id: string, updateUserDto: UpdateUserDto): Promise<void> {
//     if (updateUserDto.email) {
//       const existingEmail = await this.findOneByEmail(updateUserDto.email);
//       if (existingEmail && existingEmail.id !== id) {
//         throw new BadRequestException('Cet email est déjà utilisé');
//       }
//     }

//     if (updateUserDto.phoneNumber) {
//       const existingPhone = await this.findOneByPhoneNumber(updateUserDto.phoneNumber);
//       if (existingPhone && existingPhone.id !== id) {
//         throw new BadRequestException('Ce numéro de téléphone est déjà utilisé');
//       }
//     }
//   }

//   // Méthodes de gestion des photos de profil
//   async uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<string> {
//     if (!file?.buffer) {
//       throw new BadRequestException('Fichier invalide');
//     }

//     const user = await this.findOneById(userId);
//     await this.deleteProfilePhotoFile(user.profilePhoto);
    
//     await fs.mkdir(this.uploadDir, { recursive: true });
//     const fileName = this.generatePhotoFileName(userId, file);
//     const filePath = path.join(this.uploadDir, fileName);
    
//     await fs.writeFile(filePath, file.buffer);
    
//     const photoUrl = this.generatePhotoUrl(fileName);
//     await this.update(userId, { profilePhoto: photoUrl });
    
//     return photoUrl;
//   }

//   async deleteProfilePhoto(userId: string): Promise<void> {
//     const user = await this.findOneById(userId);
//     await this.deleteProfilePhotoFile(user.profilePhoto);
//     await this.update(userId, {
//       profilePhoto: 'https://via.placeholder.com/150'
//     });
//   }

//   private async deleteProfilePhotoFile(photoUrl: string): Promise<void> {
//     if (!photoUrl || photoUrl.includes('placeholder')) {
//       return;
//     }

//     try {
//       const fileName = photoUrl.split('/').pop();
//       if (fileName) {
//         const filePath = path.join(this.uploadDir, fileName);
//         await fs.unlink(filePath);
//       }
//     } catch (error) {
//       console.error('Erreur lors de la suppression du fichier:', error);
//     }
//   }

//   private generatePhotoFileName(userId: string, file: Express.Multer.File): string {
//     return `${userId}-${Date.now()}${path.extname(file.originalname)}`;
//   }

//   private generatePhotoUrl(fileName: string): string {
//     const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
//     return `${baseUrl}/uploads/profiles/${fileName}`;
//   }

//   // Méthode de suppression
//   async delete(id: string): Promise<void> {
//     const user = await this.findOneById(id);
//     await this.deleteProfilePhotoFile(user.profilePhoto);
    
//     const result = await this.usersRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException('Utilisateur non trouvé');
//     }
//   }
// }


//src/users/users.service.ts


import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity/user.entity';
import { Professional } from '../professionals/entities/professional.entity/professional.entity';
import { Appointment } from '../appointments/entities/appointment.entity/appointment.entity';
import { Review } from './entities/review.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfessionalDto } from '../professionals/dto/update-professional.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private configService: ConfigService,
  ) {
    this.uploadDir = path.join(process.cwd(), 'Uploads', 'profiles');
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

  async findOneById(id: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['professional'],
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    if (user.role === 'professional' && user.professional) {
      const ratingSummary = await this.getProfessionalRatingSummary(id);
      return {
        ...user,
        specialty: user.professional.specialty,
        about: user.professional.about,
        location: user.professional.location,
        availabilities: user.professional.availabilities,
        consultationPrices: user.professional.consultationPrices,
        averageRating: ratingSummary.average,
        reviewsCount: ratingSummary.count,
      };
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

  async updateProfessionalProfile(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['professional'],
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const { fullName, profilePhoto, phoneNumber, address, specialty, about, location, availabilities, consultationPrices } = updateProfessionalDto;

    // Update User entity
    const userUpdate: Partial<User> = { 
      fullName, 
      profilePhoto, 
      phoneNumber, 
      address: address ?? undefined 
    };
    Object.assign(user, userUpdate);
    await this.usersRepository.save(user);

    // Update or create Professional entity
    let professional = user.professional;
    if (!professional && user.role === 'professional') {
      professional = this.professionalRepository.create({ userId: id, specialty: specialty || '' });
    }
    if (professional) {
      const professionalUpdate: Partial<Professional> = { specialty, about, location, availabilities, consultationPrices };
      this.professionalRepository.merge(professional, professionalUpdate);
      await this.professionalRepository.save(professional);
    }

    // Return combined data
    const ratingSummary = await this.getProfessionalRatingSummary(id);
    return {
      ...user,
      specialty: professional?.specialty,
      about: professional?.about,
      location: professional?.location,
      availabilities: professional?.availabilities,
      consultationPrices: professional?.consultationPrices,
      averageRating: ratingSummary.average,
      reviewsCount: ratingSummary.count,
    };
  }

  async getReviewsForProfessional(professionalId: string) {
    await this.ensureProfessionalExists(professionalId);
    const reviews = await this.reviewRepository.find({
      where: { professionalId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return reviews.map((review) =>
      this.mapReviewToResponse(review, review.user),
    );
  }

  async createReview(
    professionalId: string,
    userId: string,
    dto: CreateReviewDto,
  ) {
    if (professionalId === userId) {
      throw new BadRequestException(
        'Vous ne pouvez pas laisser un avis sur votre propre profil.',
      );
    }

    const professional = await this.ensureProfessionalExists(professionalId);
    const patient = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!patient) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const hasAppointment = await this.appointmentRepository.count({
      where: {
        professionalId,
        userId,
        status: In(['booked', 'completed']),
      },
    });
    if (hasAppointment === 0) {
      throw new BadRequestException(
        'Vous devez avoir un rendez-vous confirmé avec ce professionnel pour laisser un avis.',
      );
    }

    let review = await this.reviewRepository.findOne({
      where: { professionalId, userId },
    });

    if (review) {
      review.comment = dto.comment;
      review.rating = dto.rating;
    } else {
      review = this.reviewRepository.create({
        professionalId,
        userId,
        comment: dto.comment,
        rating: dto.rating,
      });
    }

    const saved = await this.reviewRepository.save(review);
    const savedWithUser = await this.reviewRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });

    const response = this.mapReviewToResponse(
      savedWithUser ?? saved,
      savedWithUser?.user ?? patient,
    );

    const ratingSummary = await this.getProfessionalRatingSummary(
      professionalId,
    );

    return {
      review: response,
      averageRating: ratingSummary.average,
      reviewsCount: ratingSummary.count,
      professionalName: professional.fullName,
    };
  }

  async updateReview(
    professionalId: string,
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
    isAdmin = false,
  ) {
    await this.ensureProfessionalExists(professionalId);
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, professionalId },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }
    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres avis.',
      );
    }
    if (dto.comment !== undefined) {
      review.comment = dto.comment;
    }
    if (dto.rating !== undefined) {
      review.rating = dto.rating;
    }
    const saved = await this.reviewRepository.save(review);
    const ratingSummary = await this.getProfessionalRatingSummary(
      professionalId,
    );
    return {
      review: this.mapReviewToResponse(saved, review.user),
      averageRating: ratingSummary.average,
      reviewsCount: ratingSummary.count,
    };
  }

  async deleteReview(
    professionalId: string,
    reviewId: string,
    userId: string,
    isAdmin = false,
  ) {
    await this.ensureProfessionalExists(professionalId);
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, professionalId },
    });
    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }
    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres avis.',
      );
    }
    await this.reviewRepository.delete(review.id);
    const ratingSummary = await this.getProfessionalRatingSummary(
      professionalId,
    );
    return {
      averageRating: ratingSummary.average,
      reviewsCount: ratingSummary.count,
    };
  }

  private async ensureProfessionalExists(professionalId: string): Promise<User> {
    const professional = await this.usersRepository.findOne({
      where: { id: professionalId },
    });
    if (!professional || professional.role !== 'professional') {
      throw new NotFoundException('Professionnel introuvable');
    }
    return professional;
  }

  private async getProfessionalRatingSummary(professionalId: string) {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.professionalId = :professionalId', { professionalId });

    const result = await query.getRawOne<{ avg: string | null; count: string }>();
    const count = result?.count ? parseInt(result.count, 10) : 0;
    const avg =
      result?.avg && count > 0 ? parseFloat(result.avg) : null;

    return {
      average: avg !== null ? Number(avg.toFixed(1)) : null,
      count,
    };
  }

  private mapReviewToResponse(review: Review, author?: User | null) {
    const ratingNumber =
      typeof review.rating === 'string'
        ? parseFloat(review.rating)
        : Number(review.rating);
    const userName = author?.fullName ?? author?.email ?? null;
    return {
      id: review.id,
      professionalId: review.professionalId,
      userId: review.userId,
      comment: review.comment,
      text: review.comment,
      rating: Number.isNaN(ratingNumber) ? null : ratingNumber,
      fullName: author?.fullName ?? null,
      user: userName,
      email: author?.email ?? null,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
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

    const fileName = photoUrl.split('/').pop();
    if (!fileName) {
      return;
    }

    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError?.code === 'ENOENT') {
        return;
      }
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }

  private generatePhotoFileName(userId: string, file: Express.Multer.File): string {
    return `${userId}-${Date.now()}${path.extname(file.originalname)}`;
  }

  private generatePhotoUrl(fileName: string): string {
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    return `${baseUrl}/Uploads/profiles/${fileName}`;
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
