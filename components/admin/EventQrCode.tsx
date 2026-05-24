'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function EventQrCode({ slug }: { slug: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/visitor/${slug}`
    : `/visitor/${slug}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { width: 160, margin: 2 }, () => {
      setReady(true);
    });
  }, [url]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `event-${slug}-qr.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="flex items-end gap-3">
      <canvas ref={canvasRef} className="rounded border border-slate-200" />
      {ready && (
        <button
          onClick={handleDownload}
          className="rounded bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
        >
          Download QR
        </button>
      )}
    </div>
  );
}
