import type { WebdevUser, User } from "$lib/types/types";
export const webDevUserToUser = (webdevUser: WebdevUser) => {
    const user: User = {
        id: webdevUser.IDUtilisateur,
        userName: webdevUser.Utilisateur,
        password: webdevUser.MotDePasse,
        lastName: webdevUser.Nom,
        firstName: webdevUser.Prénom,
        company: webdevUser.Société,
        address: webdevUser.Adresse,
        city: webdevUser.Ville,
        zipcode: webdevUser.cp,
        telephone: webdevUser.Téléphone,
        email: webdevUser.Utilisateur,
        role: webdevUser.Droits,
        other1: webdevUser.Autre1,
        other2: webdevUser.Autre2,
        other3: webdevUser.Autre3,
    }
    return user
}

export const userToWebDevUser = (user: User) => {
    const webdevUser: WebdevUser = {
        IDUtilisateur: user.id,
        Utilisateur: user.userName,
        MotDePasse: user.password,
        Nom: user.lastName,
        Prénom: user.firstName,
        Société: user.company,
        Adresse: user.address,
        Ville: user.city,
        cp: user.zipcode,
        Téléphone: user.phone,
        Email: user.email,
        Droits: user.role,
        Autre1: user.other1,
        Autre2: user.other2,
        Autre3: user.other3,
    }
    return webdevUser
}