# Personal PWA

A personal, mobile-first PWA for keeping location-based notes. Notes are stored in
the browser's IndexedDB and remain available on the device without a backend.

## Development

```sh
npm install
npm run dev
```

To enable Google Maps, create `.env.local` and set a restricted Maps JavaScript
API key:

```sh
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

Without a key, the map screen remains usable for saved notes, manual coordinates,
and current-location capture. Geolocation requires HTTPS (or localhost) and user
permission.

## Production

```sh
npm run build
npm run preview
```

Serve the built app over HTTPS to install it on iPhone. In Safari, use **Share →
Add to Home Screen**. The service worker caches the app shell; Google Maps and
other external services still require a network connection.
