'use client'
import { useState } from 'react'
import { CalendarDays, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

// Image imports
import image0 from "../../../public/assets/0.jpg"
import image1 from "../../../public/assets/1.jpg"
import image2 from "../../../public/assets/2.jpg"
import image3 from "../../../public/assets/3.jpg"
import image4 from "../../../public/assets/4.jpg"
import image5 from "../../../public/assets/5.jpg"
import image6 from "../../../public/assets/6.jpg"
import image7 from "../../../public/assets/7.jpg"
import image8 from "../../../public/assets/8.jpg"
import image9 from "../../../public/assets/9.jpg"

type Event = {
  id: string
  title: string
  description: string
  date: Date
  location: string
  type: 'Technical' | 'Cultural' | 'Workshop' | 'Sports'
}

const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Talk: AI & ML',
    description: 'An in-depth session on emerging trends in AI and Machine Learning.',
    date: new Date('2025-08-14T14:00:00'),
    location: 'Auditorium A',
    type: 'Technical',
  },
  {
    id: '2',
    title: 'Cultural Fest: Rhythm 2025',
    description: 'Join us for a night of dance, drama, and music.',
    date: new Date('2025-08-18T18:00:00'),
    location: 'Open Grounds',
    type: 'Cultural',
  },
  {
    id: '3',
    title: 'Web Dev Workshop',
    description: 'Hands-on workshop for building full-stack web apps.',
    date: new Date('2025-08-20T10:00:00'),
    location: 'Lab 204',
    type: 'Workshop',
  },
  {
    id: '4',
    title: 'Inter-College Football Match',
    description: 'Cheer for our team as they face our rivals!',
    date: new Date('2025-08-22T16:00:00'),
    location: 'College Stadium',
    type: 'Sports',
  },
]

// Combine all images into one array
const carouselImages = [
  image0, image1, image2, image3, image4,
  image5, image6, image7, image8, image9,
]

export default function EventScheduler() {
  const [currentImage, setCurrentImage] = useState(0)

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black py-14 px-6 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center">🎉 Upcoming College Events</h1>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {dummyEvents.map((event) => (
            <div
              key={event.id}
              className="relative bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-600/20 hover:scale-[1.01] transition-transform"
            >
              <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
                <CalendarDays size={16} />
                {format(event.date, 'MMM dd, yyyy | hh:mm a')}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{event.title}</h2>
              <p className="text-zinc-400 text-sm mb-4">{event.description}</p>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={16} />
                {event.location}
              </div>
              <div className="absolute top-4 right-4 bg-cyan-600 text-xs px-3 py-1 rounded-full font-semibold uppercase shadow-md">
                {event.type}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Section */}
        <div className="mt-16 text-center space-y-4">
          <h2 className="text-3xl font-semibold">📸 Event Highlights Gallery</h2>
          <div className="relative max-w-3xl mx-auto">
            <img
              src={carouselImages[currentImage].src}
              alt={`Event image ${currentImage + 1}`}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
              <ChevronRight />
            </button>
          </div>
          <p className="text-zinc-400 text-sm">
            Showing image {currentImage + 1} of {carouselImages.length}
          </p>
        </div>
      </div>
    </div>
  )
}
