import React, { useState, useEffect } from 'react';
import EventCard from './components/EventCard.jsx';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError('Could not load events.');
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  async function handleRsvp(id) {
    setError('');
    try {
      const res = await fetch('/api/events/' + id + '/rsvp', { method: 'POST' });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error || 'RSVP failed.');
        return;
      }
      const updatedEvent = await res.json();
      setEvents((prev) => prev.map((e) => e.id === updatedEvent.id?{...e, attendees: updatedEvent.attendees, capacity: updatedEvent.capacity}
    : e));
    } catch (err) {
      setError('RSVP failed.');
    }
  }

  return (
    <div className="page">
      <h1>This Week's Club Events</h1>
      {loading && <p className="status">Loading events...</p>}
      {error && <p className="error">{error}</p>}
      <div className="event-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
        ))}
      </div>
    </div>
  );
}
