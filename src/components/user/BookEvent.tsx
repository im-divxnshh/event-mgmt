'use client';

import { useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';

interface BookEventProps {
  userId: string;
}

type EventFormData = {
  title: string;
  description: string;
  date: string;
  location: string;
};

export default function BookEvent({ userId }: BookEventProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', userId, 'events'), {
        ...data,
        timestamp: Timestamp.now(),
      });
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('Error booking event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded">
          ✅ Event booked successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          {...register('title', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <textarea
          placeholder="Event Description"
          {...register('description', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="date"
          {...register('date', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          {...register('location', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Booking...' : 'Book Event'}
        </button>
      </form>
    </div>
  );
}
