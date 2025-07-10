'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { db } from '@/utils/firebase' 

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'msg'), {
        ...formData,
        timestamp: serverTimestamp(),
      })

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thanks for reaching out. We&rsquo;ll get back to you shortly.',
        confirmButtonColor: '#3b82f6',
      })

      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        confirmButtonColor: '#ef4444',
      })
      console.error('Error saving message:', error)
    }
  }

  return (
    <section
      id="contact"
      className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white py-20 px-6 sm:px-12"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Contact <span className="text-blue-500">Us</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? Reach out to us and we&rsquo;ll be happy to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-500" />
              <div>
                <h4 className="font-semibold text-white">Email</h4>
                <p className="text-gray-400 text-sm">alokkumar703773347@gmail.com || Sanjeev0067279@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-blue-500" />
              <div>
                <h4 className="font-semibold text-white">Phone</h4>
                <p className="text-gray-400 text-sm">+91 70377 33470 || +91 72485 03495</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <div>
                <h4 className="font-semibold text-white">Office</h4>
                <p className="text-gray-400 text-sm">XYZ, XYZ, XX, YY - 243001</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium shadow-md transition"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
