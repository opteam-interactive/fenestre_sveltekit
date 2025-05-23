import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRdvsByDate } from '$lib/server/services/rdvServices';
import { format } from 'date-fns'
import { allTimeSlots } from "$lib/server/utils/constants";
import type { FormattedResponse, Timeslot } from '$lib/types/types';

export const GET: RequestHandler = async ({ url, params } : { url: URL, params: { date: string } }) => {

    try {
        const date = params.date;

        if (!date) {
            error(400, 'Missing date parameter');
        }


        //GET RDVs
        const rdvResponse = await getRdvsByDate(date);
       

        if (!rdvResponse.success || !Array.isArray(rdvResponse.data)) {
            // If no appointments found, send all time slots
            const responseData: FormattedResponse = {
                success: true,
                data: allTimeSlots
            }
            return new Response(JSON.stringify(responseData), { status: 200 });
        }

        const rdvs = rdvResponse.data;

        let maxCapacityAtelierP = 16;
        let maxCapacityCarrosserieP = 12;
        //now check remaining capacity
        rdvs.forEach(rdv => {
            if (rdv.NomActivité === "AtelierP") {
                maxCapacityAtelierP -= rdv.NbHeureTx;
            }

            if (rdv.NomActivité === "CarrosserieP") {
                maxCapacityCarrosserieP -= rdv.NbHeureTx;
            }
        });

        // console.log("maxCapacityAtelierP", maxCapacityAtelierP);
        // console.log("maxCapacityCarrosserieP", maxCapacityCarrosserieP);
        if (maxCapacityAtelierP <= 0 || maxCapacityCarrosserieP <= 0) {
            const responseData: FormattedResponse = {
                success: false,
                error: "Tous les créneaux sont remplis pour ce jour, merci de sélectionner une autre date."
            }
            return new Response(JSON.stringify(responseData), { status: 200 });
        }

    

        // Clone the array to avoid mutating the original
        const availableSlots = [...allTimeSlots];

        //Extract booked time : convert to time then keep only hour and min
        const bookedTimes = rdvs.map((appointment) => {
            const date = new Date(appointment.DateRécept);
            return date.toTimeString().slice(0, 5); // "08:00"
        });

        // For each booked time, remove one matching slot from availableSlots
        for (const booked of bookedTimes) {
            const index = availableSlots.findIndex(slot => slot.startHour === booked);
            if (index !== -1) {
                availableSlots.splice(index, 1); // Remove only one matching slot
            }
        }

        const responseData: FormattedResponse<Timeslot[]> = {
            success: true,
            data: availableSlots,
        }
        //return filtered array
        return new Response(JSON.stringify(responseData), { status: 200 });


    }
    catch (error) {
        console.error(error);
        const responseData: FormattedResponse = {
            success: false,
            error: "Internal server error",
        }
        return new Response(JSON.stringify(responseData), { status: 500 });

    }

};