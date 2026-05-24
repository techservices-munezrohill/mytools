'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type Props = { lat: number; lng: number; name: string; address?: string | null };

export default function ListingLocationMap({ lat, lng, name, address }: Props) {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
      <path d="M12 0C7 0 3 4 3 9c0 7 9 18 9 18s9-11 9-18c0-5-4-9-9-9z" fill="#2b8a3e"/>
      <circle cx="12" cy="9" r="3.2" fill="#fff"/>
    </svg>
  `);

  const pinIcon = L.icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`,
    iconSize: [36, 54],
    iconAnchor: [18, 54],
    popupAnchor: [0, -46],
  });

  return (
    <div className="h-64 md:h-80 overflow-hidden rounded-xl border border-brand-100 shadow-soft">
      <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" detectRetina={true} attribution="" />
        <Marker position={[lat, lng]} icon={pinIcon}>
          <Popup>
            <div className="space-y-1">
              <div className="text-sm font-semibold">{name}</div>
              {address && <div className="text-xs text-slate-600">{address}</div>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}