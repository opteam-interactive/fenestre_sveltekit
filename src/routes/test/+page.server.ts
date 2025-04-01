import type { PageServerLoad, Actions } from './$types';
import { sendEmail } from '$lib/server/sendEmail';
import { fail } from '@sveltejs/kit';

export type FormData = {
    name: string;
    email: string;
    message: string;
};
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const message = formData.get('message');

        if (!name || !email || !message) {
            return fail(400, { error: 'All fields are required' });
        }
		const response = await sendEmail(email, name, message);
        if (!response.success) {
            return fail(400, { error: response.error });
        }
        
        return { success: 'Email sent successfully' };
	},
	
} satisfies Actions;