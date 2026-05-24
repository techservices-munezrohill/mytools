'use client';

import React from 'react';

interface ReportRow {
  code: string;
  count: number;
  first_seen: string;
  last_seen: string;
}

export default function ReferralReportTable({ initial }: { initial: ReportRow[] }) {
  
  const handleExport = () => {
    if (!initial || initial.length === 0) return;

    // Define headers
    const headers = ["Code", "Visits", "First Seen", "Last Seen"];
    
    // Map data to CSV rows
    const rows = initial.map(row => [
      row.code,
      row.count,
      new Date(row.first_seen).toLocaleString(),
      new Date(row.last_seen).toLocaleString()
    ]);

    // Build the string
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // Create a download link and trigger it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `referral_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-2 font-semibold">Code</th>
            <th className="pb-2 font-semibold">Visits</th>
            <th className="pb-2 font-semibold">First seen</th>
            <th className="pb-2 font-semibold">Last seen</th>
          </tr>
        </thead>
        <tbody>
          {initial.map((row) => (
            <tr key={row.code} className="border-b border-slate-100 last:border-0">
              <td className="py-3 font-medium text-slate-800">{row.code}</td>
              <td className="py-3 text-slate-600">{row.count}</td>
              <td className="py-3 text-xs text-slate-500">
                {row.first_seen ? new Date(row.first_seen).toLocaleString() : 'N/A'}
              </td>
              <td className="py-3 text-xs text-slate-500">
                {row.last_seen ? new Date(row.last_seen).toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
          {initial.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                No traffic data found for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}