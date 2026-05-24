'use client';

import Link from 'next/link';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';

type Listing = {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  category: string;
  address: string | null;
};

type Props = { listings: Listing[] };

const defaultCenter: [number, number] = [-1.9536, 30.0605];

export default function PublicDirectoryMap({ listings }: Props) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, []);

  const center = userPos ?? defaultCenter;
  const visibleListings = useMemo(
    () => listings.filter((l) => l.lat != null && l.lng != null),
    [listings],
  );

  // inline SVG pin (green) - data URL
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
      <path d="M12 0C7 0 3 4 3 9c0 7 9 18 9 18s9-11 9-18c0-5-4-9-9-9z" fill="#2b8a3e"/>
      <circle cx="12" cy="9" r="3.2" fill="#fff"/>
    </svg>
  `);

  const pinIcon = L.icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-brand-100 shadow-soft">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" detectRetina={true} attribution="" />

        {userPos && (
          <Marker position={userPos} icon={pinIcon}>
            <Popup>You are here (approximate)</Popup>
          </Marker>
        )}

        {visibleListings.map((listing) => (
          <Marker key={listing.id} position={[listing.lat as number, listing.lng as number]} icon={pinIcon}>
            <Popup>
              <div className="space-y-1">
                <div className="text-sm font-semibold">{listing.name}</div>
                {listing.address && <div className="text-xs text-slate-600">{listing.address}</div>}
                <div className="mt-1 flex flex-col gap-1">
                  <Link href={`/directory/${listing.id}`} className="inline-block text-xs font-medium text-brand-700 underline">
                    View details
                  </Link>
                  <Link href={`/directory?category=${listing.category}`} className="inline-block text-[11px] text-brand-700/80 underline">
                    View more like this
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}