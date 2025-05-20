import {z} from "zod"

export const rdvSchema = z.object({
  brand: z.string().min(2).max(20),
  model: z.string().min(2).max(20),
  plateNumber: z.string().min(2).max(20),
  task: z.number(),
  //see about type for date and time
  appointmentDate: z.date(),
  appointmentTime: z.string(),
  rdvCategory: z.enum(["AtelierP", "CarrosserieP"]).nullable().default("AtelierP"),
  rental: z.boolean(),
  rentalCategory: z.enum(['eco', 'standard']).default('eco').nullable(),
  rentalDrive: z.enum(['manual', 'auto']).default('manual').nullable(),
  contactless: z.enum(['true', 'false']).nullable().default("false"),
  chiffrage: z.boolean()
  //Complete with more info
})