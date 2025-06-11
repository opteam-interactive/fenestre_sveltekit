import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	envDir: './env',
	plugins: [tailwindcss(), sveltekit()]
});
