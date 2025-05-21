import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../../[date]/$types';
import { getRdvsByDate } from '$lib/server/services/rdvServices';
import { format } from 'date-fns'
import { allTimeSlots } from "$lib/server/utils/constants";

export const GET: RequestHandler = async ({ url, params }) => {

    try {
        const date = params.date;

        if (!date) {
            error(400, 'Missing date parameter');
        }


        //GET RDVs
        const rdvResponse = await getRdvsByDate(date);
        if (!rdvResponse.success || !Array.isArray(rdvResponse.data)) {
            // If no appointments found, send all time slots
            return new Response(JSON.stringify(allTimeSlots), { status: 200 });
        }
        const rdvs = rdvResponse.data;

    

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
        //return filtered array
        return new Response(JSON.stringify(availableSlots), { status: 200 });


    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });

    }

};