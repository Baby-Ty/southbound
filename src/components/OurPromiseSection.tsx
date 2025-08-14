'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ChatModal from './ChatModal';

const OurPromiseSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sky-200">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Promise Content */}
          <div className="relative">
            {/* Dashed Border Box */}
            <div className="border-4 border-dashed border-gray-800 bg-white p-6 rounded-lg relative">
              {/* Header */}
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-4">🧡</span>
                <h2 className="text-2xl font-bold text-gray-900">OUR PROMISE</h2>
              </div>

              {/* Greeting */}
              <p className="text-gray-900 font-medium mb-4">Howzit,</p>

              {/* Main Promise */}
              <div className="space-y-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  We are here to make working abroad simple, social, and unforgettable.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We take care of the logistics so you can focus on living, working, and exploring.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We have been in your shoes: sorting SIM cards, dealing with patchy Wi-Fi, and hunting for a decent apartment with a good desk and even better coffee. We built the service we wish we had, one that truly gets it.
                </p>
              </div>

              {/* What You Can Count On */}
              <div className="mb-6">
                <p className="text-gray-900 font-medium mb-3">Here is what you can count on:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-4">▸</span>
                    Epic spots to live, work, and explore
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-4">▸</span>
                    A solid setup to stay productive
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-4">▸</span>
                    A journey designed for growth, not just escape
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-4">▸</span>
                    A crew that has your back
                  </li>
                </ul>
              </div>

              {/* Closing */}
              <p className="text-gray-700 font-medium mb-6">
                You focus on the experience. We will handle the rest.
              </p>

              {/* Signature */}
              <div className="mb-6">
                <p className="text-gray-900 font-medium">
                  The South Bound Team <span className="ml-1">✈️ 🌍</span>
                </p>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 shadow-lg"
              >
                CLICK TO CHAT
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-96 lg:h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60"
              alt="Scenic mountain landscape with person overlooking valley"
              fill
              className="object-cover rounded-2xl shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            {/* Adventure Travel Badge */}
            <div className="absolute bottom-8 right-8 w-32 h-32">
              <div className="relative w-full h-full">
                {/* Circular Badge Background */}
                <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <div className="text-center">
                    {/* Compass/Navigation Icon */}
                    <div className="w-8 h-8 mx-auto mb-1 text-gray-700">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5L14 4.5L12 6L10 4.5L9 5.5L3 7V9L9 7.5V21H11V12H13V21H15V7.5L21 9Z"/>
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-gray-700 leading-tight">
                      ADVENTURE<br />TRAVEL
                    </div>
                  </div>
                </div>
                
                {/* Decorative dots around the badge */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      <ChatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default OurPromiseSection; 
