// // // src/professionals/dto/update-professional.dto.ts
// // import { IsOptional, IsString, IsUUID } from 'class-validator';

// // export class UpdateProfessionalDto {
// //   @IsOptional()
// //   @IsString()
// //   specialty?: string;

// //   @IsOptional()
// //   @IsUUID()
// //   userId?: string; // ID de l'utilisateur associé
// // }





// // // src/professionals/dto/update-professional.dto.ts

// // import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

// // export class UpdateProfessionalDto {
// //   @IsOptional()
// //   @IsString()
// //   specialty?: string;

// //   @IsOptional()
// //   @IsString()
// //   about?: string;

// //   @IsOptional()
// //   @IsString()
// //   location?: string;

// //   @IsOptional()
// //   @IsObject()
// //   availabilities?: Record<string, Record<number, { hour: number; minute: number }[]>>;

// //   @IsOptional()
// //   @IsObject()
// //   consultationPrices?: Record<string, string>;

// //   @IsOptional()
// //   @IsUUID()
// //   userId?: string;

// //   @IsOptional()
// //   @IsString()
// //   fullName?: string;

// //   @IsOptional()
// //   @IsString()
// //   profilePhoto?: string;

// //   @IsOptional()
// //   @IsString()
// //   phoneNumber?: string;

// //   @IsOptional()
// //   @IsString()
// //   address?: string;
// // }




// import { IsOptional, IsString, IsObject, Validate } from 'class-validator';
// import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// @ValidatorConstraint({ name: 'availabilities', async: false })
// class AvailabilitiesValidator implements ValidatorConstraintInterface {
//   validate(value: any, args: ValidationArguments) {
//     if (value === null || value === undefined) return true; // Allow null/undefined

//     if (typeof value !== 'object') return false;

//     for (const type in value) {
//       const days = value[type];
//       if (typeof days !== 'object') return false;

//       for (const day in days) {
//         const slots = days[day];
//         if (!Array.isArray(slots)) return false;

//         for (const slot of slots) {
//           if (typeof slot !== 'object' || 
//               typeof slot.hour !== 'number' || slot.hour < 0 || slot.hour > 23 ||
//               typeof slot.minute !== 'number' || slot.minute < 0 || slot.minute > 59) {
//             return false;
//           }
//         }
//       }
//     }
//     return true;
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'Availabilities must be a valid object with type -> day -> [{ hour: 0-23, minute: 0-59 }] structure';
//   }
// }

// export class UpdateProfessionalDto {
//   @IsOptional()
//   @IsString()
//   specialty?: string;

//   @IsOptional()
//   @IsString()
//   about?: string;

//   @IsOptional()
//   @IsString()
//   location?: string;

//   @IsOptional()
//   @IsObject()
//   @Validate(AvailabilitiesValidator)
//   availabilities?: Record<string, Record<number, { hour: number; minute: number }[]>>;

//   @IsOptional()
//   @IsObject()
//   consultationPrices?: Record<string, string>;

//   @IsOptional()
//   @IsString()
//   fullName?: string;

//   @IsOptional()
//   @IsString()
//   profilePhoto?: string;

//   @IsOptional()
//   @IsString()
//   phoneNumber?: string;

//   @IsOptional()
//   @IsString()
//   address?: string;
// }


import { IsOptional, IsString, IsObject, Validate, IsDateString, IsEnum, IsArray } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'availabilities', async: false })
class AvailabilitiesValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === null || value === undefined) return true;

    if (typeof value !== 'object') return false;

    for (const type in value) {
      const days = value[type];
      if (typeof days !== 'object') return false;

      for (const day in days) {
        const slots = days[day];
        if (!Array.isArray(slots)) return false;

        for (const slot of slots) {
          if (typeof slot !== 'object' || 
              typeof slot.hour !== 'number' || slot.hour < 8 || slot.hour > 18 ||  // Limité entre 8h et 18h
              typeof slot.minute !== 'number' || slot.minute < 0 || slot.minute > 59) {
            return false;
          }
        }
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Les disponibilités doivent être un objet valide avec la structure type -> jour -> [{ hour: 8-18, minute: 0-59 }]';
  }
}

@ValidatorConstraint({ name: 'consultationPrices', async: false })
class ConsultationPricesValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === null || value === undefined) return true;

    if (typeof value !== 'object') return false;

    for (const type in value) {
      const price = value[type];
      if (typeof price !== 'string') return false;
      
      // Vérifie que le prix est au format "X FCFA"
      const priceRegex = /^\d+\s*FCFA$/;
      if (!priceRegex.test(price)) return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Les prix de consultation doivent être au format "X FCFA"';
  }
}

export class UpdateProfessionalDto {
  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsObject()
  @Validate(AvailabilitiesValidator)
  availabilities?: Record<string, Record<number, { hour: number; minute: number }[]>> | null;

  @IsOptional()
  @IsObject()
  @Validate(ConsultationPricesValidator)
  consultationPrices?: Record<string, string> | null;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string | null;
}