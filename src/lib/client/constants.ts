
import type { MotifQuestions } from "$lib/types/types"


export const motifQuestions: MotifQuestions[] = [
    {
        idMotifRDV: 2,
        Motif: "REVISION",
        textInput:false,
        questions: [
            {
                label: "Nombre de kilomètres",
                slug: "kilometrage",
                answers: [
                    "5000",
                    "10000",
                    "20000",
                    "30000",
                    "40000",
                    "50000",
                    "60000",
                    "70000",
                    "80000",
                    "90000",
                    "100000", ,
                    "110000",
                    "120000",
                    "130000",
                    "140000",
                    "150000",
                    "160000",
                    "170000",
                    "180000",
                    "190000",
                    "200000"
                ] as string[]
            },
            {
                label: "Type de contrat",
                slug: "type_contrat",
                answers: [
                    "AUCUN CONTRAT",
                    "MAINTENANCE PEUGEOT",
                    "ARVAL SERVICE LEASE",
                    "ARVAL FLEET SERVICE",
                    "ALD TEMSYS",
                    "LEASE PLAN"
                ]
            }
        ]
    },
    {
        idMotifRDV: 3,
        Motif: "Travaux Carrosserie",
        textInput: false
    },
    {
        idMotifRDV: 4,
        Motif: "DIAG - VOYANT 90€",
        textInput: true,
        textInputLabel: "Description des symptômes",
        questions: [
            {
                label: "Type de voyant",
                slug: "type",
                answers: [
                    'Moteur',
                    'ABS',
                    'Urée',
                    'Stop & Start'
                ]
            },
            {
                label: "Fréquence du problème",
                slug: "frequence",
                answers: [
                    "Permanent",
                    "Intermittent"
                ]
            },
            {
                label: "Perte de puissance",
                slug: "perte_puissance",
                answers: [
                    "Avec perte de puissance",
                    "Sans perte de puissance"
                ]
            }
        ]
    },
    {
        idMotifRDV: 5,
        Motif: "DIAG - BRUIT 90€",
        textInput: true,
        textInputLabel: "Description des symptômes",
        questions: [
            {
                label: "Type de bruit",
                slug: "type",
                answers: [
                    "Couinement",
                    "Grincement",
                    "Claquement",
                    "Métallique",
                    "Sifflement",
                    "Vibrations"
                ]
            },
            {
                label: "Position du bruit",
                slug: "position",
                answers: [
                    "Avant",
                    "Arriere",
                ]
            },
            {
                label: "Fréquence du problème",
                slug: "frequence",
                answers: [
                    "Permanent",
                    "Intermittent"
                ]
            },
            {
                label: "Type de route",
                slug: "type_route",
                answers: [
                    "Route accidentée",
                    "Sur parking"
                ]
            }

        ]
    },
    {
        idMotifRDV: 6,
        Motif: "Distribution",
        textInput: false
    },
    {
        idMotifRDV: 7,
        Motif: "Contrôle Technique avec prépa 90€",
        textInput: false
    },
    {
        idMotifRDV: 8,
        Motif: "Contrôle Technique sans prépa 60€",
        textInput: false
    },
    {
        idMotifRDV: 9,
        Motif: "Pneus x2",
        textInput: true,
        textInputLabel: "Taille obligatoire ex: 225/45-R17-91W",
        questions: [
            {
                label: "Position",
                slug: "position",
                answers: [
                    "Avant",
                    "Arriere",
                ]
            },
            {
                label: "Type de pneu",
                slug: "type_pneu",
                answers: [
                    "Été",
                    "Hivers",
                    "Toutes saisons"
                ]
            },

        ]
    },
    {
        idMotifRDV: 10,
        Motif: "Pneus x4",
        textInput: true,
        textInputLabel: "Taille obligatoire ex: 225/45-R17-91W",
        questions: [
            {
                label: "Type de pneu",
                slug: "type_pneu",
                answers: [
                    "Été",
                    "Hivers",
                    "Toutes saisons"
                ]
            }
        ]
    },
    {
        idMotifRDV: 11,
        Motif: "Freinage Plaquettes x2",
        textInput: false,
        questions: [
            {
                label: "Position",
                slug: "position",
                answers: [
                    "Avant",
                    "Arriere",
                ]
            }
        ]
    },
    {
        idMotifRDV: 12,
        Motif: "Freinage Disques/Plaquettes x2",
        textInput: false,
        questions: [
            {
                label: "Position",
                slug: "position",
                answers: [
                    "Avant",
                    "Arriere",
                ]
            }
        ]
    },
    {
        idMotifRDV: 13,
        textInput: false,
        Motif: "Freinage Plaquettes x4",
    },
    {
        idMotifRDV: 14,
        textInput: false,
        Motif: "Freinage Disques/Plaquettes x4",
    },
    {
        idMotifRDV: 15,
        textInput: false,
        Motif: "Expertise",
        questions: [
            {
                label: "Type d'expertise",
                slug: "type_expertise",
                answers: [
                    "BCA",
                    "Creativ Expertise",
                    "Référence Expertise",
                    "Expertise et Concept (Vroom)",
                    "Autre"

                ]
            }
        ]
    },
    {
        idMotifRDV: 16,
        Motif: "DIAG - FUITE 90€",
        textInput: true,
        textInputLabel: "Description des symptômes",
        questions: [
            {
                label: "Type de fuite",
                slug: "type_fuite",
                answers: [
                    "Huile",
                    "Huile moteur",
                    "Liquide refroidissement",
                    "Liquide NSP"
                ]
            }
        ]
    },
    {
        idMotifRDV: 17,
        Motif: "Pare-brise",
        textInput: false
    },
    {
        idMotifRDV: 19,
        Motif: "DIAG - CLIMATISATION 90€",
        textInput: true,
        textInputLabel: "Description des symptômes",
        
    },
    {
        idMotifRDV: 20,
        Motif: "Travaux mécanique",
        textInput:false
    },
    {
        idMotifRDV: 21,
        Motif: "DIAG - MECANIQUE 90€",
        textInput: true,
        textInputLabel: "Description des symptômes",
    },

]