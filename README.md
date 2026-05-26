# Weather Forecast

A responsive Vue 3 single-page application that delivers current conditions and a multi-day forecast for any city in the world, with favorites, multi-language support, and a dynamic weather-driven UI.

**Live demo:** [weather-app-kappa-orpin-64.vercel.app](https://weather-app-kappa-orpin-64.vercel.app/)

## Functionality

- Auto-detects the user's location on first load (via `auto:ip`).
- City autocomplete search with debounced suggestions and request cancellation.
- Track up to 5 cities side-by-side and switch between them.
- Toggle between **current day** and **3-day forecast** views.
- Interactive temperature chart for the selected city.
- Save cities to a **Favorites** list (persisted in `localStorage`).
- Bilingual UI: **English** and **Ukrainian** (i18n with full re-fetch of localized weather data on language change).
- Dynamic background that changes based on the current weather condition and day/night.
- Fully responsive layout (desktop, tablet, mobile).

## Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vite.dev/) — build tool & dev server
- [vue-i18n](https://vue-i18n.intlify.dev/) — localization (en / uk)
- [axios](https://axios-http.com/) — HTTP client with request interceptors
- [Chart.js](https://www.chartjs.org/) — forecast visualization
- [Lucide Icons](https://lucide.dev/) — iconography
- ESLint + Prettier — linting and formatting

## API

This project uses the [WeatherAPI.com](https://www.weatherapi.com/) REST API:

- `GET /forecast.json` — current weather and multi-day forecast.
- `GET /search.json` — city autocomplete.

The API key and base URL are injected on every request via an axios interceptor, along with the active UI locale so responses are localized automatically.

## Project Setup

Create a `.env` file in the project root:

```sh
VITE_API_URL=https://api.weatherapi.com/v1
VITE_API_KEY=your_weatherapi_key
```

Install dependencies:

```sh
npm install
```

### Development

```sh
npm run dev
```

### Production build

```sh
npm run build
```

### Lint & format

```sh
npm run lint
npm run format
```