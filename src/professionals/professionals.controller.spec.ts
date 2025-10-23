// //src/professionals/professionals.controller.spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { ProfessionalsController } from './professionals.controller';

// describe('ProfessionalsController', () => {
//   let controller: ProfessionalsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ProfessionalsController],
//     }).compile();

//     controller = module.get<ProfessionalsController>(ProfessionalsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });




import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity/professional.entity';
import { User } from '../users/entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ProfessionalsController', () => {
  let controller: ProfessionalsController;
  let service: ProfessionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalsController],
      providers: [
        ProfessionalsService,
        {
          provide: getRepositoryToken(Professional),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProfessionalsController>(ProfessionalsController);
    service = module.get<ProfessionalsService>(ProfessionalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUser', () => {
    it('should return combined user and professional data', async () => {
      const user: Partial<User> = { id: '1', email: 'pro@example.com', role: 'professional', fullName: 'Dr. John Doe' };
      const professional = {
        id: '1',
        userId: '1',
        specialty: 'Cardiology',
        about: 'Expert',
        location: 'Lomé',
        availabilities: { 'À domicile': { 1: [{ hour: 9, minute: 0 }] } },
        consultationPrices: { 'À domicile': '15000 FCFA' },
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findByUser').mockResolvedValue({ ...user, ...professional });

      const result = await controller.findByUser(user as User);
      expect(result).toEqual({ ...user, ...professional });
    });

    it('should throw ForbiddenException for non-professional users', async () => {
      const user = { id: '1', email: 'user@example.com', role: 'user' };
      await expect(controller.findByUser(user as User)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if no professional profile exists', async () => {
      const user = { id: '1', email: 'pro@example.com', role: 'professional' };
      jest.spyOn(service, 'findByUser').mockResolvedValue(null);
      await expect(controller.findByUser(user as User )).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return combined data', async () => {
      const user = { id: '1', email: 'pro@example.com', role: 'professional', fullName: 'Dr. John Doe' };
      const professional = {
        id: '1',
        userId: '1',
        specialty: 'Cardiology',
        availabilities: { 'À domicile': { 1: [{ hour: 9, minute: 0 }] } },
      };
      const updateDto = { specialty: 'Neurology', fullName: 'Dr. Jane Doe' };
      jest.spyOn(service, 'findOne').mockResolvedValue(professional as any);
      jest.spyOn(service, 'update').mockResolvedValue({ ...user, ...professional, ...updateDto });

      const result = await controller.update('1', updateDto, user as User);
      expect(result).toEqual({ ...user, ...professional, ...updateDto });
    });

    it('should throw ForbiddenException for unauthorized users', async () => {
      const user = { id: '2', email: 'other@example.com', role: 'user' };
      const professional = { id: '1', userId: '1', specialty: 'Cardiology' };
      jest.spyOn(service, 'findOne').mockResolvedValue(professional as any);
      await expect(controller.update('1', {}, user as User)).rejects.toThrow(ForbiddenException);
    });
  });
});