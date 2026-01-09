'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Same job. Better days.",
    description: "The details are handled so you can focus on living and working somewhere better.",
    icon: "💼"
  },
  {
    title: "Easy to live in",
    description: "Comfortable, work-friendly places in good neighbourhoods, set up so you can settle in quickly and enjoy everyday life.",
    icon: "🏡"
  },
  {
    title: "A better rhythm",
    description: "Enough structure to stay productive, enough freedom to enjoy where you are.",
    icon: "⚖️"
  },
  {
    title: "Move at your pace",
    description: "Want to stay longer, move cities, or slow things down? Your trip isn't locked in. It can evolve as you go.",
    icon: "🚶"
  }
];

const ExperienceSection = () => {
  return (
    <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Not just a holiday. <br/>
              <span className="text-[#E86B32]">A lifestyle upgrade.</span>
            </h2>
            <p className="text-stone-300 text-lg mb-12 leading-relaxed">
              Live and work somewhere better, without quitting your job or turning your life upside down.
            </p>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-white/10 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-stone-300 leading-relaxed text-sm font-medium">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Collage or single impactful image */}
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Remote working community"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
            
            <Link href="/discover" className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-stone-300 border-2 border-stone-800"></div>
                    ))}
                </div>
                <div>
                    <p className="font-bold text-white group-hover:text-[#E86B32] transition-colors duration-300">Build your route</p>
                    <p className="text-xs text-stone-300">Starting from Cape Town</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
