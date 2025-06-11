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

## Error handling
### Services
- throw error with new Error in case of expected error.
- catch unexpected errors, log them and immediately log and rethrow them

### Form actions & api endpoints
- If expected error and need to show the user some message, use "fail"(sveltekit) or "message"(Superforms), to send back both a message and a response status
- If using "message", provide the form state, a message and an object with a status:code like so:

```js
return message(form, "Une erreur est survenue lors de l'action updateUser. Veuillez réessayer.", 
                    {
                        status: 400
                    }
                );
```
- If unexpeted (catch), throw a sveltekit "error" that can be show appropriately using error boundaries and +error pages

### pages
- get the "message" from superforms and the page status and display a message accordingly