# FENESTRE FRONTEND

## Stack
- TailwindCSS
- Daisyui (ui library based on tailwind)
- Superform (form validation)
- date-fns (date formatting)
- jsonwebtoken (sateless auth)
- WEBDEV API

## Structure
- 
- $lib/components: components if reusable. 
- route/component : If only used in ONE route (ex forms), they are in the same folder as the route. This helps to know what action the form uses
- $lib/assets : images and other assets that need to be processed 
- $lib/types: types and ZOD objects (for validation) 
- $lib/utils: reusable utility functions are in 
- $lib/server : actions that need to be done on the server (auth, data management etc...)

