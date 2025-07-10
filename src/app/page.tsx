'use client';

import { TypeAnimation } from 'react-type-animation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';



import Event from "@/components/main/Event";
import About from '@/components/main/About';
import Contact from '@/components/main/Contact';
import Testimonials from '@/components/main/Testimonials';
import EventSchedular from '@/components/main/EventSchedular';


import Image1 from "../../public/assets/1.jpg";

const LandingPage = () => {


  return (
    <>
      <Navbar />


      {/* Main content */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white pt-20 px-4">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
              Host, Discover, and Join Amazing Events
            </h1>
            <TypeAnimation
              sequence={[
                'Tech Conferences 🧠',
                1500,
                'Live Music Shows 🎸',
                1500,
                'Startup Pitches 🚀',
                1500,
                'Community Fests 🎉',
                1500,
              ]}
              wrapper="span"
              speed={50}
              className="block text-blue-600 text-2xl font-semibold"
              repeat={Infinity}
            />
            <p className="text-gray-600 text-lg">
              Eventify helps you create, explore, and manage events with ease. Whether you&rsquo;re
              organizing a seminar or attending a concert — it&rsquo;s all possible here.
            </p>

            <div className="flex space-x-4">
              <Link
                href="/#events"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition"
              >
                Explore Events
              </Link>


            </div>
          </div>

          <div>
            <Image
              src={Image1}
              alt="Event Hero"
              className="w-full h-auto rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      <section id="events">
        <Event />
      </section>

      <section id="eventschedular">
        <EventSchedular />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="contact">
        <Contact />
      </section>

    </>
  );
};

export default LandingPage;
