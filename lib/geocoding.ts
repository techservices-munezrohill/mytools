import { z } from 'zod';

const GeocodeResultSchema = z.object({
  results: z.array(
    z.object({
      geometry: z.object({
        location: z.object({ lat: z.number(), lng: z.number() }),
      }),
    }),
  ),
  status: z.string(),
});

export async function geocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return null;
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', address);
  url.searchParams.set('key', apiKey);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    const data = GeocodeResultSchema.parse(json);
    if (data.status !== 'OK' || data.results.length === 0) {
      return null;
    }
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  } catch {
    return null;
  }
}
