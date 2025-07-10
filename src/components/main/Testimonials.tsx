'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { format } from 'date-fns'

type Testimonial = {
  name: string
  review: string
  rating: number
  date: Date
}

const dummyTestimonials: Testimonial[] = [
  {
    name: 'Emily Carter',
    review: 'This service exceeded all my expectations. The team was professional, efficient, and incredibly friendly!',
    rating: 5,
    date: new Date('2024-09-12'),
  },
  {
    name: 'James Patel',
    review: 'Good experience overall. There were a few hiccups but the support team was responsive and helpful.',
    rating: 4,
    date: new Date('2024-08-23'),
  },
  {
    name: 'Liam Nguyen',
    review: 'Highly recommended! Everything was smooth and well organized. Will definitely use again.',
    rating: 5,
    date: new Date('2024-10-01'),
  },
  {
    name: 'Sophia Kim',
    review: 'A fantastic experience from start to finish. The interface is clean and the process is intuitive.',
    rating: 5,
    date: new Date('2024-11-05'),
  },
  {
    name: 'Noah Johnson',
    review: 'The quality was decent, but I think there’s still room for improvement in some areas.',
    rating: 3,
    date: new Date('2024-06-30'),
  },
]

export default function Testimonials() {
  const [testimonials] = useState<Testimonial[]>(dummyTestimonials)

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">💬 What Our Users Say</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-cyan-400">{t.name}</h3>
                <span className="text-xs text-zinc-400">{format(t.date, 'MMM dd, yyyy')}</span>
              </div>
              <p className="text-zinc-300 mb-4 text-sm">{t.review}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < t.rating ? '#22d3ee' : 'none'}
                    stroke={i < t.rating ? '#22d3ee' : '#64748b'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
