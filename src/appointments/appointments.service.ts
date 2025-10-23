import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity/user.entity';
import { Professional } from '../professionals/entities/professional.entity/professional.entity';

export interface AppointmentResponse {
  id: string;
  professionalId: string;
  userId: string | null;
  subject: string | null;
  type: string | null;
  price: string | null;
  notes: string | null;
  date: string;
  time: string;
  status: string;
  patient?: string | null;
  patientEmail?: string | null;
  patientPhone?: string | null;
  professionalName?: string | null;
  professionalPhoto?: string | null;
  professionalSpecialty?: string | null;
  createdAt?: Date;
}

@Injectable()
export class AppointmentsService {
  private readonly availabilityWindowInDays = 21;

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  async createAppointment(
    patientId: string,
    dto: CreateAppointmentDto,
  ): Promise<AppointmentResponse> {
    const { professionalId, date, time, subject, type, price, notes } = dto;

    const professionalUser = await this.userRepository.findOne({
      where: { id: professionalId },
    });
    if (!professionalUser || professionalUser.role !== 'professional') {
      throw new NotFoundException('Professionnel introuvable');
    }

    if (professionalId === patientId) {
      throw new ForbiddenException(
        'Un professionnel ne peut pas réserver un rendez-vous avec lui-même',
      );
    }

    const professionalProfile = await this.professionalRepository.findOne({
      where: { userId: professionalId },
      relations: ['user'],
    });
    if (!professionalProfile) {
      throw new NotFoundException(
        'Profil professionnel introuvable pour ce médecin',
      );
    }

    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient introuvable');
    }

    this.ensureSlotIsAvailableInSchedule(
      professionalProfile,
      date,
      time,
      type,
    );

    await this.ensureSlotNotAlreadyBooked(professionalId, date, time);

    const persisted = await this.appointmentRepository.save(
      this.appointmentRepository.create({
        professionalId,
        userId: patientId,
        date,
        time,
        subject,
        type,
        price:
          price ??
          professionalProfile.consultationPrices?.[type ?? ''] ??
          null,
        notes: notes ?? null,
        status: 'booked',
      }),
    );

    return this.mapAppointmentToResponse(persisted, patient, professionalUser);
  }

  async getAppointmentsForProfessional(
    professionalId: string,
    requestingUser?: { id: string; role: string },
  ): Promise<AppointmentResponse[]> {
    const professionalUser = await this.userRepository.findOne({
      where: { id: professionalId },
    });
    if (!professionalUser || professionalUser.role !== 'professional') {
      throw new NotFoundException('Professionnel introuvable');
    }

    const professionalProfile = await this.professionalRepository.findOne({
      where: { userId: professionalId },
      relations: ['user'],
    });

    const appointments = await this.appointmentRepository.find({
      where: { professionalId },
      relations: ['patient'],
      order: { date: 'ASC', time: 'ASC' },
    });

    const bookedResponses = appointments.map((appointment) =>
      this.mapAppointmentToResponse(
        appointment,
        appointment.patient ?? null,
        professionalUser,
      ),
    );

    const wantsConfidentialData =
      requestingUser &&
      (requestingUser.role === 'admin' ||
        requestingUser.id === professionalId);

    const availableSlots =
      professionalProfile
        ? this.generateAvailableSlots(
            professionalProfile,
            professionalId,
            appointments,
          )
        : [];

    if (wantsConfidentialData) {
      return this.sortAppointments([...bookedResponses, ...availableSlots]);
    }

    return this.sortAppointments(availableSlots);
  }

  async getAppointmentsForPatient(
    patientId: string,
  ): Promise<AppointmentResponse[]> {
    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient introuvable');
    }

    const appointments = await this.appointmentRepository.find({
      where: { userId: patientId },
      relations: ['professional'],
      order: { date: 'ASC', time: 'ASC' },
    });

    const professionalIds = Array.from(
      new Set(
        appointments
          .map((appt) => appt.professionalId)
          .filter((id): id is string => typeof id === 'string'),
      ),
    );

    const professionalProfiles = professionalIds.length
      ? await this.professionalRepository.find({
          where: professionalIds.map((id) => ({ userId: id })),
        })
      : [];

    return this.sortAppointments(
      appointments.map((appointment) => {
        const professionalProfile = professionalProfiles.find(
          (profile) => profile.userId === appointment.professionalId,
        );
        return {
          ...this.mapAppointmentToResponse(
            appointment,
            patient,
            appointment.professional,
          ),
          professionalSpecialty: professionalProfile?.specialty ?? null,
        };
      }),
    );
  }

  async getAppointmentsForProfessionalAsOwner(
    professionalId: string,
  ): Promise<AppointmentResponse[]> {
    const professionalUser = await this.userRepository.findOne({
      where: { id: professionalId },
    });
    if (!professionalUser) {
      throw new NotFoundException('Professionnel introuvable');
    }

    const appointments = await this.appointmentRepository.find({
      where: { professionalId },
      relations: ['patient'],
      order: { date: 'ASC', time: 'ASC' },
    });

    return this.sortAppointments(
      appointments.map((appointment) =>
        this.mapAppointmentToResponse(
          appointment,
          appointment.patient ?? null,
          professionalUser,
        ),
      ),
    );
  }

  async updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentDto,
  ): Promise<AppointmentResponse> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'professional'],
    });
    if (!appointment) {
      throw new NotFoundException('Rendez-vous introuvable');
    }

    if (updates.status) {
      appointment.status = updates.status;
    }
    if (updates.date) {
      appointment.date = updates.date;
    }
    if (updates.time) {
      appointment.time = updates.time;
    }
    if (updates.subject !== undefined) {
      appointment.subject = updates.subject;
    }
    if (updates.type !== undefined) {
      appointment.type = updates.type;
    }
    if (updates.price !== undefined) {
      appointment.price = updates.price;
    }
    if (updates.notes !== undefined) {
      appointment.notes = updates.notes;
    }
    if (updates.userId !== undefined) {
      appointment.userId = updates.userId;
    }

    const saved = await this.appointmentRepository.save(appointment);
    return this.mapAppointmentToResponse(
      saved,
      saved.patient ?? null,
      saved.professional,
    );
  }

  private ensureSlotIsAvailableInSchedule(
    professional: Professional,
    date: string,
    time: string,
    type?: string | null,
  ) {
    if (!professional.availabilities || !type) {
      return;
    }

    const availabilityByType = professional.availabilities[type];
    if (!availabilityByType) {
      throw new BadRequestException(
        'Ce professionnel ne propose pas ce type de rendez-vous',
      );
    }

    const dayKey = this.getIsoWeekday(new Date(`${date}T00:00:00`)).toString();
    const slots = availabilityByType[dayKey] ?? [];
    const [hour, minute] = time.split(':').map((value) => parseInt(value, 10));

    const hasSlot = slots.some(
      (slot) => slot.hour === hour && slot.minute === minute,
    );

    if (!hasSlot) {
      throw new BadRequestException(
        'Ce créneau ne fait pas partie des disponibilités du professionnel',
      );
    }
  }

  private async ensureSlotNotAlreadyBooked(
    professionalId: string,
    date: string,
    time: string,
  ) {
    const existing = await this.appointmentRepository.findOne({
      where: {
        professionalId,
        date,
        time,
        status: 'booked',
      },
    });
    if (existing) {
      throw new ConflictException('Ce créneau est déjà réservé');
    }
  }

  private generateAvailableSlots(
    professional: Professional,
    professionalId: string,
    existingAppointments: Appointment[],
  ): AppointmentResponse[] {
    if (!professional.availabilities) {
      return [];
    }

    const now = new Date();
    const bookedKeys = new Set(
      existingAppointments
        .filter((appointment) => appointment.status !== 'cancelled')
        .map(
          (appointment) =>
            `${appointment.date}T${appointment.time}${
              appointment.type ?? ''
            }`.toLowerCase(),
        ),
    );

    const slots: AppointmentResponse[] = [];

    const availabilityEntries = Object.entries(professional.availabilities);
    if (availabilityEntries.length === 0) {
      return slots;
    }

    for (let dayOffset = 0; dayOffset < this.availabilityWindowInDays; dayOffset++) {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(now.getDate() + dayOffset);

      const isoWeekday = this.getIsoWeekday(date).toString();
      const dateStr = date.toISOString().split('T')[0];

      for (const [type, days] of availabilityEntries) {
        const daySlots = days?.[isoWeekday] ?? [];
        if (!Array.isArray(daySlots) || daySlots.length === 0) {
          continue;
        }

        for (const slot of daySlots) {
          const hour = this.pad(slot.hour);
          const minute = this.pad(slot.minute);
          const time = `${hour}:${minute}`;
          const slotKey = `${dateStr}T${time}${type}`.toLowerCase();

          const slotDateTime = new Date(`${dateStr}T${time}:00`);
          if (slotDateTime <= now) {
            continue;
          }

          if (bookedKeys.has(slotKey)) {
            continue;
          }

          slots.push({
            id: `slot-${slotKey}`,
            professionalId,
            userId: null,
            subject: null,
            type,
            price: professional.consultationPrices?.[type] ?? null,
            notes: null,
            date: dateStr,
            time,
            status: 'available',
            patient: null,
            patientEmail: null,
            patientPhone: null,
            professionalName: professional.user?.fullName ?? null,
            professionalPhoto: professional.user?.profilePhoto ?? null,
            professionalSpecialty: professional.specialty ?? null,
          });
        }
      }
    }

    return slots;
  }

  private mapAppointmentToResponse(
    appointment: Appointment,
    patient: User | null,
    professional: User | null,
  ): AppointmentResponse {
    return {
      id: appointment.id,
      professionalId: appointment.professionalId,
      userId: appointment.userId,
      subject: appointment.subject ?? null,
      type: appointment.type ?? null,
      price: appointment.price ?? null,
      notes: appointment.notes ?? null,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      patient: patient?.fullName ?? patient?.email ?? null,
      patientEmail: patient?.email ?? null,
      patientPhone: patient?.phoneNumber ?? null,
      professionalName: professional?.fullName ?? null,
      professionalPhoto: professional?.profilePhoto ?? null,
      createdAt: appointment.createdAt,
    };
  }

  private getIsoWeekday(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private sortAppointments(
    appointments: AppointmentResponse[],
  ): AppointmentResponse[] {
    return [...appointments].sort((a, b) => {
      const aDate = new Date(`${a.date}T${a.time}:00`);
      const bDate = new Date(`${b.date}T${b.time}:00`);
      return aDate.getTime() - bDate.getTime();
    });
  }
}
