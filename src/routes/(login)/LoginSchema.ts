import { z } from "zod";


export const loginSchema = z.object({
  userName: z.string().min(2, { message: "Nom d'utilisateur trop court" }).max(50),
  password: z.string().min(2, { message: "Mot de passe trop court" }).max(50)
})

export type LoginSchematype = z.infer<typeof loginSchema>