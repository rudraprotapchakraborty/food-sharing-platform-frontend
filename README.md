# Food Sharing Platform · Web app

Share surplus food with people nearby, or find something good to eat. Browse listings, send a request and collect the food before its deadline. The app is branded **FoodShare**.

Live: [food-sharing-platform-frontend-chi.vercel.app](https://food-sharing-platform-frontend-chi.vercel.app/) (use a test account on the sign-in page)

Backend repository: [food-sharing-platform-backend](https://github.com/rudraprotapchakraborty/food-sharing-platform-backend)

## Features

- Browse food with search, category filter, sort (ending soonest, newest, most servings) and a status filter. The state lives in the address bar, so every view can be linked or reloaded
- Each listing shows a photo, servings, pickup place, a live "time left" and the donor. Food past its deadline disappears from the list
- Request flow: ask for a listing with an optional message. The donor accepts or declines, the food is reserved, other waiting requests are declined automatically, and the donor marks it as handed over. Requesters can cancel, which puts reserved food back on the list
- Privacy: email addresses are hidden. Only after a request is accepted do the donor and that one requester see each other's email
- Share food with a live photo preview. Only the donor (or an admin) can edit or remove a listing
- Email and password sign-in with a six digit email code, Google sign-in, forgot-password reset
- Account settings: name, photo, email (confirmed by code), password, sign-in methods, delete account
- Admin area: member list with search, block, role change and delete, plus site statistics
- Light and dark mode, responsive down to phones
- Shared test accounts (Admin and User) on the sign-in page, locked so settings and the sample listings cannot be changed
- Links from the first version of the site (`/available-foods`, `/add-food`, `/manage-my-foods`, `/my-food-request`) still work

## Stack

React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, lucide-react.

## Run it locally

You need the [backend](https://github.com/rudraprotapchakraborty/food-sharing-platform-backend) running on port 5000.

```bash
npm install
cp .env.example .env.local   # then fill in GOOGLE_CLIENT_ID
npm run dev                  # http://localhost:3000
```

In development the dev server proxies `/api` to `http://127.0.0.1:5000`.

## Environment

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Public Google OAuth client id. The button is hidden when it is empty. |
| `VITE_API_URL` | Optional override of the API origin including `/api`. Production defaults to `https://food-sharing-platform-backend-blush.vercel.app/api`. |

## Deploying

The project deploys as a static site (Vercel config included, with a rewrite to `index.html` for client side routing). Set `GOOGLE_CLIENT_ID` in the host's environment, and add the site's origin to the Google client's authorized JavaScript origins. The API origin defaults to the deployed backend in `src/lib/api.js` (override with `VITE_API_URL`), and the backend's `CLIENT_URL` must list this site's origin.

## Credits

Sample food photos come from Wikipedia and Wikimedia Commons under their free licences.
