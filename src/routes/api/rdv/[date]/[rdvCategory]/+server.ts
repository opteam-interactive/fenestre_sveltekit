import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRdvsByDate } from '$lib/server/services/rdvServices';
import { allTimeSlots } from "$lib/server/utils/constants";
import type { FormattedResponse, Timeslot } from '$lib/types/types';
import { maxCapacityAtelierP, maxCapacityCarrosserieP } from '$lib/server/utils/constants';
interface ResponseData {
    availableSlots: Timeslot[];
    remainingCapacityAtelierP: number;
    remainingCapacityCarrosserieP: number;
}

export const GET: RequestHandler = async ({ url, params } : { url: URL, params: { date: string, rdvCategory: string } }) => {


    try {
        const {date, rdvCategory} = params

        if (!date || !rdvCategory) {
            error(400, 'Missing date or category parameter');
        }

        if (rdvCategory !== "AtelierP" && rdvCategory !== "CarrosserieP" && rdvCategory !== "AucunP") {
            error(400, 'Invalid category parameter');
        }

        //GET RDVs
        const rdvResponse = await getRdvsByDate(date);
        
        // If no appointments found, send back all time slots
        if (!rdvResponse.success || !Array.isArray(rdvResponse.data)) {
            const responseData: FormattedResponse = {
                success: true,
                data: allTimeSlots
            }
            return new Response(JSON.stringify(responseData), { status: 200 });
        }

        const rdvs = rdvResponse.data;

        let remainingCapacityAtelierP = maxCapacityAtelierP;
        let remainingCapacityCarrosserieP = maxCapacityCarrosserieP;
      
        //Remove used capacity for each category
        rdvs.forEach(rdv => {
            if (rdv.NomActivité === "AtelierP") {
                remainingCapacityAtelierP -= rdv.NbHeureTx;
            }

            if (rdv.NomActivité === "CarrosserieP") {
                remainingCapacityCarrosserieP -= rdv.NbHeureTx;
            }
        });

       

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

        const responseData: FormattedResponse<ResponseData> = {
            success: true,
            data: {availableSlots, remainingCapacityAtelierP, remainingCapacityCarrosserieP},
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