import { z, rdvSchema, userSchema, rdvWebdevSchema } from "$lib/types/zod"

export type Message = { status: 'error' | 'success' | 'warning'; text: string };
export type ForfaitLocation = {
    journalier: number,
    kilometrique: number
}

export type Timeslot = {
    id: number,
    startHour: string,
}

export type Motif = {
    IDMotifRDV: number,
    Cat: string,
    Motif: string,
    TempsEstimé: string,
    MemoDesConditions: string,
    CaseLibre: string,
    DemandeChiffrageON: boolean,
    NomActivité: 'AtelierP'  | 'CarrosserieP' | 'AucunP',
    NbRDVParJour: number
}
export type RendezVous = z.infer<typeof rdvSchema>
export type WebdevRendezVous = z.infer<typeof rdvWebdevSchema>


export type User = z.infer<typeof userSchema>

export type UserJwtPayload = {
        userId: number,
        email: string, 
        role: number,
        exp: number
}


export type WebdevUser = {
    IDUtilisateur: number,
    Utilisateur: string,
    MotDePasse: string,
    Nom: string,
    Prénom: string,
    Société: string,
    Adresse: string,
    Ville: string,
    cp: string,
    Téléphone: string,
    Email: string,
    Droits: number,
    Autre1: string,
    Autre2: string,
    Autre3: string,

}

// export type User = { 
//     id: number,
//     userName: string,
//     password: string,
//     lastName: string,
//     firstName: string,
//     company: string,
//     address: string,
//     city: string,
//     zipcode: string,
//     phone: string,
//     email: string,
//     role: number,
//     other1: string,
//     other2: string,
//     other3: string,
// }



export type MotifQuestions = {
    idMotifRDV: number,
    Motif: string,    
    textInput: boolean,
    textInputLabel ?: string,
    questions?: Condition[]
}
type Condition = {
    label: string,
    slug: string,
    answers: string[]
}

export type TimeSlotResponse = {
    availableSlots: Timeslot[];
    remainingCapacityAtelierP: number;
    remainingCapacityCarrosserieP: number;
}













export type ResponseWithData<T> = {
    success: boolean;
    data?: T;
    errors?: string;
    message?: string
};


export type ResponseNoData = {
    success: boolean;
    errors?: string;
    message?: string
};

export type FormattedResponse<T = unknown> = {
    success: boolean;
    error?: string;
    message?: string
    data?: T 
}

