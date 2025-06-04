import { z } from "zod"


export const profileSchema = z.object({
    email: z.string().email().min(2).max(50),
    isSociete: z.boolean(),
    societe: z.string().default(""),
    password: z.string().min(6).max(50),
    passwordConfirm: z.string().min(6).max(50),
    lastName: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    telephone: z.string().regex(new RegExp("^[0-9]*$")).min(6).max(12),
    address: z.string().min(2).max(100),
    zipcode: z.string().min(2).max(10).regex(new RegExp("^[0-9]*$")),
    city: z.string().min(2).max(50)
}).refine(data => {
    const valid = data.password === data.passwordConfirm;
    if (!valid) console.error("Password mismatch error triggered!");
    return valid;
}
    , {
        path: ['passwordConfirm'],
        message: 'Mot de passe ou confirmation incorrect',
    })

export type ProfileSchemaType = z.infer<typeof profileSchema>