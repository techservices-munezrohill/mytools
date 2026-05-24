import EventForm from '@/components/admin/EventForm';

export default function NewEventPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">New event</h1>
      <p className="text-xs text-slate-600">
        Create a visitor-facing event page. Share the QR code from the events list with attendees.
      </p>
      <EventForm />
    </div>
  );
}
