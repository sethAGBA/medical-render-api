// src/professionals/entities/professional.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
// import { User } from '../../../users/entities/user.entity/user.entity'; // Importez l'entité User
// import { Appointment } from '../../../appointments/entities/appointment.entity/appointment.entity'; // Importez l'entité Appointment

// @Entity()
// export class Professional {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   specialty: string; // Spécialité du professionnel (ex: "Médecin généraliste")

//   @ManyToOne(() => User, (user) => user.id) // Relation Many-to-One avec User
//   @JoinColumn({ name: 'userId' }) // Nom de la colonne de jointure
//   user: User; // Référence à l'utilisateur associé

//   @Column()
//   userId: string; // ID de l'utilisateur associé

//   @OneToMany(() => Appointment, (appointment) => appointment.professional) // Relation One-to-Many avec Appointment
//   appointments: Appointment[]; // Liste des rendez-vous du professionnel
// }


// src/professionals/entities/professional.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';

@Entity()
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialty: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  location: string;

  @Column('jsonb', {
    nullable: true,
    transformer: {
      from(value: any): Record<string, Record<number, { hour: number; minute: number }[]>> | null {
        if (!value) return null;
        // Validate structure
        for (const key in value) {
          const days = value[key];
          for (const day in days) {
            const slots = days[day];
            for (const slot of slots) {
              if (typeof slot.hour !== 'number' || slot.hour < 0 || slot.hour > 23 ||
                  typeof slot.minute !== 'number' || slot.minute < 0 || slot.minute > 59) {
                throw new Error('Invalid availability format');
              }
            }
          }
        }
        return value;
      },
      to(value: Record<string, Record<number, { hour: number; minute: number }[]>> | null): any {
        return value;
      },
    },
  })
  availabilities: Record<string, Record<number, { hour: number; minute: number }[]>> | null;

  @Column('jsonb', { nullable: true })
  consultationPrices: Record<string, string> | null;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
