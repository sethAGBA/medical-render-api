// src/appointments/entities/appointment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';

export type AppointmentStatus = 'available' | 'booked' | 'cancelled' | 'completed';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  subject: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  price: string | null;

  @Column({
    type: 'enum',
    enum: ['available', 'booked', 'cancelled', 'completed'],
    default: 'booked',
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => User, (user) => user.patientAppointments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  patient: User | null;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.professionalAppointments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'professionalId' })
  professional: User;

  @Column({ type: 'uuid' })
  professionalId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
