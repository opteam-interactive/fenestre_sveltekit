import { format } from "date-fns"
import { fr } from 'date-fns/locale/fr';


export function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number) {


    const slots: string[] = [];

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
            if (hour === endHour && minutes > 0) break;
            slots.push(`${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);

        }
    }

    return slots;
}


export function formatDate(inputDate: string) {
    try {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred");
    }

};


export const convertUtfToLocale = (date: Date, time: string) => {
    try {
         // Convert UTC to local date (France)
    const utcDate = new Date(date);

    // Set the time from form input
    const [hours, minutes] = time.split(":").map(Number);
    utcDate.setHours(hours, minutes); // This modifies in local time

    // Format properly for France (Local Time)
    const formattedDate = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss.SSS", { locale: fr });

    return formattedDate
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred");
    }
   
}