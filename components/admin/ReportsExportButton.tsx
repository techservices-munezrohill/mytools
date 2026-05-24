'use client';

import Papa from 'papaparse';

type ExportData = {
  demographics: {
    gender: { label: string; count: number }[];
    age: { label: string; count: number }[];
    province: { label: string; count: number }[];
  };
  articles: { title: string; views: number }[];
  searchGaps: { term: string; searches: number }[];
};

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsExportButton({ data }: { data: ExportData }) {
  const handleExport = () => {
    // Combine all reports into a single CSV with a "section" column
    const rows: Record<string, unknown>[] = [];

    for (const g of data.demographics.gender) {
      rows.push({ section: 'Gender', label: g.label, count: g.count });
    }
    for (const a of data.demographics.age) {
      rows.push({ section: 'Age range', label: a.label, count: a.count });
    }
    for (const p of data.demographics.province) {
      rows.push({ section: 'Province', label: p.label, count: p.count });
    }
    for (const a of data.articles) {
      rows.push({ section: 'Article performance', label: a.title, count: a.views });
    }
    for (const s of data.searchGaps) {
      rows.push({ section: 'Service gaps', label: s.term, count: s.searches });
    }

    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`mytools-report-${date}.csv`, rows);
  };

  return (
    <button
      onClick={handleExport}
      className="rounded bg-brand-700 px-4 py-2 text-xs font-medium text-white hover:bg-brand-800"
    >
      Download CSV report
    </button>
  );
}
