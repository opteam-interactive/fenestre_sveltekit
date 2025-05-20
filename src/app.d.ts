// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserJwtPayload } from "$lib/types/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserJwtPayload | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
