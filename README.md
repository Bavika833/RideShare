# RideShare Campus — Student Carpooling

RideShare Campus is a React + Express + MongoDB starter for campus ride offers and requests. Students can filter by route and date, post trips, compare seats and contributions, and open the route in Google Maps directions.

## Run locally

1. Install Node.js 18 or newer and MongoDB, or leave `MONGO_URI` unset to use in-memory sample data.
2. Copy `.env.example` to `.env` and set `MONGO_URI` if you want persistent rides.
3. Run `npm install`, then `npm run dev` and open the Vite URL from the terminal.
4. Run `npm run build` then `npm start` for a production build.

Route links open Google Maps Directions without an API key. `VITE_GOOGLE_MAPS_API_KEY` is reserved for a future embedded Maps JavaScript integration. Campus SSO, direct rider messaging, map key restrictions, and production privacy controls still need configuration.
