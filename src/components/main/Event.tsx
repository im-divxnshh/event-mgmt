'use client'
import React, { useEffect, useState, useRef } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

type Media = {
  id: string
  title: string
  src: string
  type: 'photo' | 'video'
  visible: boolean
  position: number
}

export default function EventGallery() {
  const [media, setMedia] = useState<Media[]>([])
  const galleryRef = useRef(null)

  useEffect(() => {
    const fetchMedia = async () => {
      const [photosSnap, videosSnap] = await Promise.all([
        getDocs(query(collection(db, 'photo'), orderBy('position'))),
        getDocs(query(collection(db, 'video'), orderBy('position')))
      ])
      const photos = photosSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Media, 'id'>) }))
      const videos = videosSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Media, 'id'>) }))
      const all = [...photos, ...videos].filter(m => m.visible).sort((a, b) => a.position - b.position)
      setMedia(all)
    }
    fetchMedia()
  }, [])

  useEffect(() => {
    if (!galleryRef.current) return
    gsap.fromTo(
      '.media-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
        }
      }
    )
  }, [media])

  const tabs = {
    All: media,
    Photos: media.filter(m => m.type === 'photo'),
    Videos: media.filter(m => m.type === 'video'),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#1f1f1f] text-white px-6 py-10 md:py-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-white tracking-tight"
        >
          🖼️ Event Gallery
        </motion.h1>

        <Tab.Group>
          <Tab.List className="flex justify-center flex-wrap gap-4 mb-10">
            {Object.keys(tabs).map(tab => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  clsx(
                    'px-5 py-2.5 rounded-full text-sm md:text-base font-medium transition-all border',
                    selected
                      ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {Object.values(tabs).map((items, idx) => (
              <Tab.Panel key={idx}>
                {items.length === 0 ? (
                  <div className="text-center text-zinc-500 py-20">No media available in this category.</div>
                ) : (
                  <div
                    ref={galleryRef}
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  >
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="media-card group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-700 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
                      >
                        <div className="w-full h-64 overflow-hidden">
                          {item.type === 'photo' ? (
                            <img
                              src={item.src}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <video
                              src={item.src}
                              muted
                              loop
                              autoPlay
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <div className="p-4 border-t border-zinc-800">
                          <h3 className="text-sm font-semibold truncate text-white">{item.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}
