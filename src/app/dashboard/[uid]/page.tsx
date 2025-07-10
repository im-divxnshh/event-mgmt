'use client';

import { use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FiLogOut, FiCalendar, FiClipboard } from 'react-icons/fi';

// Lazy load heavy components
const BookEvent = dynamic(() => import('@/components/user/BookEvent'));
const EventManager = dynamic(() => import('@/components/user/EventManager'));

interface DashboardPageProps {
  params: Promise<{ uid: string }>; // Next.js 15 style
}

export default function DashboardPage(props: DashboardPageProps) {
  const { uid } = use(props.params); // Unwrap params using `use()`
  const [activeTab, setActiveTab] = useState<'book' | 'manager'>('book');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        notFound();
      } else {
        setUserData(docSnap.data());
      }
    };
    fetchData();
  }, [uid]);

  if (!userData) return <div className="p-10 text-center text-lg">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white shadow-md flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-blue-600">
          Welcome, {userData.name?.split(' ')[0]} 🎉
        </h1>
        <button
          onClick={() => (window.location.href = '/')}
          className="flex items-center gap-2 text-sm bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-full"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="w-full bg-white border-b">
        <div className="max-w-4xl mx-auto flex justify-center space-x-6 py-3">
          <button
            onClick={() => setActiveTab('book')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-md 
              ${activeTab === 'book'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-600'
              }`}
          >
            <FiCalendar /> Book Event
          </button>
          <button
            onClick={() => setActiveTab('manager')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-md 
              ${activeTab === 'manager'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-600'
              }`}
          >
            <FiClipboard /> Event Manager
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 space-y-4">
          {activeTab === 'book' ? (
            <>
              <h2 className="text-lg font-semibold text-blue-500">📅 Book a New Event</h2>
              <BookEvent userId={uid} />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-blue-500">🗂 Your Booked Events</h2>
              <EventManager userId={uid} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
