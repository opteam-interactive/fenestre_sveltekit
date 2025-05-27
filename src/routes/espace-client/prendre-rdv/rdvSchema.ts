import {z} from "zod"

export const rdvSchema = z.object({
  brand: z.string().min(2).max(20),
  model: z.string().min(2).max(20),
  plateNumber: z.string().min(2).max(20),
  motifId: z.number(),
  motifDetails: z.string(),
  //see about type for date and time
  appointmentDate: z.date().nullable(),
  appointmentTime: z.string().nullable(),
  rental: z.boolean(),
  rentalCategory: z.enum(['eco', 'standard']).default('eco').nullable(),
  rentalDrive: z.enum(['manual', 'auto']).default('manual').nullable(),
  contactless: z.enum(['true', 'false']).nullable().default("false"),
  chiffrage: z.boolean(),
  kilometers: z.string(),
  //Complete with more info
}).refine((data) => {
  // If contactless is 'false', then both appointmentDate and appointmentTime must be set
  if (data.contactless === 'false') {
    return data.appointmentDate !== null && data.appointmentTime !== null;
  }
  return true;
}, {
  message: "Une date est nécessaire pour un dépot sur nos horaires d'ouverture",
  path: ["appointmentDate"] // You can change this to ["appointmentTime"] or make multiple refinements if needed
});


export type rdvSchemaType = z.infer<typeof rdvSchema>