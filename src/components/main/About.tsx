'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CalendarHeart, Users, MapPin, Sparkles, Layers3, Bell } from 'lucide-react'

const features = [
  {
    icon: CalendarHeart,
    title: 'Create & Manage Events',
    description: 'Easily organize your seminars, meetups, or festivals with just a few clicks.',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description: 'Foster engagement with user profiles, comments, and real-time interactions.',
  },
  {
    icon: MapPin,
    title: 'Smart Location Tools',
    description: 'Find or host events near you using our integrated map and location system.',
  },
  {
    icon: Sparkles,
    title: 'Beautiful UI & Animations',
    description: 'Enjoy a modern, responsive design enhanced with smooth motion and interactivity.',
  },
  {
    icon: Layers3,
    title: 'Seamless Dashboard',
    description: 'Intuitive admin panel to track events, participants, and statistics with ease.',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Stay informed with live updates about your events and attendee activity.',
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white py-20 px-6 sm:px-12"
    >
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            About <span className="text-blue-500">Eventify</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Eventify is a dynamic platform empowering you to host, manage, and discover events like never before.
            Whether it&rsquo;s a tech conference, music show, or community fest &mdash; we&rsquo;ve got you covered.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.15 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 shadow-xl transition duration-300 hover:border-blue-500"
            >
              <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center pt-10"
        >
          <h3 className="text-2xl font-semibold mb-4">Ready to create your next big event?</h3>
          <p className="text-gray-400">
            Join Eventify today and bring your ideas to life with the power of our event platform.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
