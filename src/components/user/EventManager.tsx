'use client';

import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface EventManagerProps {
  userId: string;
}

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

export default function EventManager({ userId }: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'events'));
        const userEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Event, 'id'>;
          userEvents.push({ id: doc.id, ...data });
        });

        setEvents(userEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  if (loading) return <p>Loading your events...</p>;

  if (events.length === 0) {
    return <p className="text-gray-500">No events found. Book one to get started!</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white border shadow rounded-lg p-5 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-600">{event.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{event.description}</p>
          <div className="mt-3 text-sm text-gray-500">
            📍 <strong>Location:</strong> {event.location}<br />
            📆 <strong>Date:</strong> {event.date}
          </div>
        </div>
      ))}
    </div>
  );
}
