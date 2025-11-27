'use client';

import React from 'react';
import Image from 'next/image';

const ActivitiesBentoGridSimple: React.FC = () => {
  const experiences = [
    {
      id: 'surfing',
      title: 'Surf Breaks',
      subtitle: 'Catch waves before work',
      icon: '🏄',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
      description: 'World-class breaks in Bali, Mexico, and Portugal'
    },
    {
      id: 'hiking',
      title: 'Mountain Trails',
      subtitle: 'Weekend adventures await',
      icon: '🥾',
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      description: 'Epic hikes from Andes to Alps'
    },
    {
      id: 'temples',
      title: 'Ancient Wonders',
      subtitle: 'Culture & history',
      icon: '🛕',
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      image: 'https://images.unsplash.com/photo-1563614294-da5d5a3903de?auto=format&fit=crop&w=800&q=80',
      description: 'Temples, ruins, and sacred sites'
    }
  ];

  const bonusActivities = [
    { icon: '🤿', name: 'Diving', color: 'text-blue-600' },
    { icon: '🧘', name: 'Yoga', color: 'text-purple-600' },
    { icon: '🍜', name: 'Food Tours', color: 'text-orange-600' },
    { icon: '🎨', name: 'Art & Crafts', color: 'text-pink-600' },
    { icon: '🚵', name: 'Cycling', color: 'text-green-600' },
    { icon: '🏖️', name: 'Beach Days', color: 'text-cyan-600' }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 mb-6 bg-gradient-to-r from-orange-100 to-teal-100 px-5 py-2.5 rounded-full border border-orange-200/50 shadow-sm">
            <span className="text-2xl animate-bounce">✨</span>
            <span className="text-sm font-semibold text-gray-700 tracking-wide">Your Adventure Awaits</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            What You'll <span className="bg-gradient-to-r from-sb-orange-500 to-pink-600 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Work remotely from the world's most inspiring destinations.<br />
            <span className="text-sb-orange-500 font-semibold">Balance productivity with unforgettable adventures.</span>
          </p>
        </div>

        {/* Main Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="group relative h-[400px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${exp.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-8">
                {/* Icon */}
                <div className="flex justify-end">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {exp.icon}
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                  <p className="text-white/90 text-sm font-medium uppercase tracking-wider">{exp.subtitle}</p>
                  <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">{exp.title}</h3>
                  <p className="text-white/80 text-base font-medium">{exp.description}</p>
                  
                  {/* Explore Arrow */}
                  <div className="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                    <span>Explore</span>
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bonus Activities Grid */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Plus So Much More...
            </h3>
            <p className="text-gray-600 text-lg">
              Every destination offers unique experiences tailored to your interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bonusActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 group cursor-pointer"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {activity.icon}
                </div>
                <p className={`font-semibold ${activity.color} text-sm`}>
                  {activity.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-6">
            Ready to turn weekends into adventures?
          </p>
          <a
            href="/route-builder"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sb-orange-500 to-pink-600 hover:from-sb-orange-600 hover:to-pink-700 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <span className="mr-3">🗺️</span>
            Start your journey
            <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesBentoGridSimple;
