import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/fr/zod.json";

// lng and resources key depend on your locale.
i18next.init({
  lng: "fr",
  resources: {
    fr: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

// export configured zod instance
export { z }


export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().email().min(2).max(50),
  password: z.string().min(6).max(50).optional().nullable(),
  passwordConfirm: z.string().min(6).max(50).optional().nullable(),
  category: z.enum(['particulier', 'societe']).default("particulier"),
  societe: z.string().default("").optional().nullable(),
  lastName: z.string().min(2).max(50).default("").optional().nullable(),
  firstName: z.string().min(2).max(50).default("").optional().nullable(),
  telephone: z.string().regex(new RegExp("^[0-9]*$")).min(6).max(12).default("").optional().nullable(),
  address: z.string().min(2).max(100).default("").optional().nullable(),
  zipcode: z.string().min(2).max(10).regex(new RegExp("^[0-9]*$")).default("").optional().nullable(),
  city: z.string().min(2).max(50).default("").optional().nullable(),
}).refine(data => {
  const valid = data.password === data.passwordConfirm;
  if (!valid) console.log("Password mismatch error triggered!");
  return valid;
}
  , {
    path: ['passwordConfirm'],
    message: 'Mot de passe ou confirmation incorrect',
  })

  
  const motifSchema = z.object({

      IDMotifRDV:z.number(),
      Cat: z.string(),
      Motif: z.string(),
      TempsEstimé: z.string(),
      MemoDesConditions: z.string(),
      CaseLibre: z.string(),
      DemandeChiffrageON: z.boolean(),
      NomActivité: z.enum(['AtelierP','CarrosserieP']) ,
      NbRDVParJour: z.number()

  })


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

export const rdvWebdevSchema = z.object({
 IDRendezVous: z.number().nullable(),
  NomSite: z.enum(["PEUGEOT"]),
  DateRécept : z.string(),
  DateRestit: z.string(),
  Client: z.string(),
  Téléphone: z.string(),
  Mobile: z.string(),
  ClientEmail: z.string().email(),
  ClientAdresse: z.string(),
  ClientCP: z.string(),
  ClientVille: z.string(),
  Marque: z.string(),
  Modèle: z.string(),
  Version: z.string(),
  immatriculation: z.string(),
  Travaux: z.string(),
  NomActivité: z.enum(['AtelierP', 'CarrosserieP', 'AucunP']),
  NbHeureTx: z.number(),
  Observations: z.string(),
  IDVoiturePret: z.number(),
  ClientAssurance: z.string(),
  Cdé: z.boolean().nullable(),
  DépotSansContact: z.boolean(),
  CréateurDateh: z.string().length(17).regex(/^\d+$/, {
    message: "Invalid format. Use exactly 17 digits (yyyymmddhhmmssccc).",
  }),
  ModifieurDateh: z.string(),
  ModifieurID: z.number().nullable(),
  IDMotifRDV: z.number().nullable(),
  IDUtilisateur: z.number().nullable(),
  IDVéhicule: z.number().nullable(),
  SaisieDuClient: z.string().nullable(),
  Etat: z.number().nullable(),
  Blacklistage: z.string().nullable()

})