export default function EmergencyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Emergency Card</h1>
      <p className="text-sm text-slate-600">
        This screen is always cached for offline use and will contain critical emergency
        contacts and safety tips.
      </p>
      <ul className="space-y-2 text-sm">
        <li>• Emergency phone numbers (to be configured by MRI).</li>
        <li>• Nearest safe health center (based on last known location).</li>
        <li>• Short safety tips (5–6 bullet points).</li>
      </ul>
    </div>
  );
}
