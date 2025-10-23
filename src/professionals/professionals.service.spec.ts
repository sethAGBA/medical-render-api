//src/professionals/professionals.service.spec.ts



import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity/professional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
  ) {}

  async findAll(): Promise<Professional[]> {
    return this.professionalRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Professional> {
    const professional = await this.professionalRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!professional) {
      throw new NotFoundException(`Professional #${id} not found`);
    }
    return professional;
  }

  async findByUser(userId: string): Promise<Professional | null> {
    const professional = await this.professionalRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    return professional || null;
  }

  async create(createProfessionalDto: CreateProfessionalDto): Promise<Professional> {
    const professional = this.professionalRepository.create(createProfessionalDto);
    return this.professionalRepository.save(professional);
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<Professional> {
    const professional = await this.findOne(id);
    this.professionalRepository.merge(professional, updateProfessionalDto);
    return this.professionalRepository.save(professional);
  }

  async remove(id: string): Promise<void> {
    const professional = await this.findOne(id);
    await this.professionalRepository.remove(professional);
  }
}
