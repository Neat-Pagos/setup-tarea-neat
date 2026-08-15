// Contact the user on each adoption update (approved or rejected)

import { AdoptionStatus, UserData } from "../models/Adoption.js";

export const contactUser = async (userData: UserData, adoptionStatus: AdoptionStatus): Promise<void> => {
    const { name, email } = userData;

    let message: string;

    switch (adoptionStatus) {
        case AdoptionStatus.PENDING:
            message = `Hola ${name}, recibimos tu solicitud de adopción. Pronto comenzaremos a revisarla.`;
            break;
        case AdoptionStatus.UNDER_REVIEW:
            message = `Hola ${name}, tu solicitud de adopción está siendo revisada por nuestro equipo.`;
            break;
        case AdoptionStatus.APPROVED:
            message = `¡Hola ${name}! Tu solicitud de adopción fue aprobada. Nos contactaremos contigo para coordinar la entrega.`;
            break;
        case AdoptionStatus.REJECTED:
            message = `Hola ${name}, lamentamos informarte que tu solicitud de adopción fue rechazada.`;
            break;
        case AdoptionStatus.DELIVERED:
            message = `¡Hola ${name}! La adopción fue entregada exitosamente. Esperamos que disfrutes esta nueva etapa junto a tu Pokémon.`;
            break;
        case AdoptionStatus.DELIVERY_FAILED:
            message = `Hola ${name}, no pudimos completar la entrega de tu adopción. Nos contactaremos contigo para resolverlo.`;
            break;
        case AdoptionStatus.SECURITY_CONCERN:
            message = `Hola ${name}, detectamos una situación que requiere una revisión de seguridad en tu adopción. Nuestro equipo se pondrá en contacto contigo.`;
            break;
    }

    await contactByEmail(email, message);
};

const SEND_EMAIL_URL = 'https://us-central1-neatwebplatform-beta.cloudfunctions.net/sendEmail';

const contactByEmail = async (email: string, message: string): Promise<void> => {
    const apiKey = process.env.EMAIL_API_KEY;

    if (!apiKey) {
        throw new Error('EMAIL_API_KEY is not configured');
    }

    const response = await fetch(SEND_EMAIL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-neat-api-key': apiKey,
        },
        body: JSON.stringify({
            to: email,
            subject: 'Actualización de tu solicitud de adopción',
            text: message,
        }),
    });

    if (!response.ok) {
        throw new Error(`Email service failed (${response.status}): ${await response.text()}`);
    }
};
