'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  duration: string;
  vibe: string[];
}

const LetsChatForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    destination: '',
    duration: '',
    vibe: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePillSelect = (field: keyof FormData, value: string) => {
    if (field === 'vibe') {
      setFormData(prev => ({
        ...prev,
        vibe: prev.vibe.includes(value) 
          ? prev.vibe.filter(v => v !== value)
          : [...prev.vibe, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-700 mb-4">
            let&apos;s CHAT
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You can fill in as much or as little as you want – we can always discuss these details later
          </p>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Dashed Border Form */}
          <div className="border-4 border-dashed border-gray-800 rounded-xl bg-[#f9fdfd] shadow-sm p-8 relative">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="let&apos;s start with your name 👋"
                  className="w-full border-b-2 border-gray-300 focus:border-teal-600 bg-transparent py-3 text-lg placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="So we can send your trip plan 📧"
                  className="w-full border-b-2 border-gray-300 focus:border-teal-600 bg-transparent py-3 text-lg placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="WhatsApp preferred — makes it easier to chat 📱"
                  className="w-full border-b-2 border-gray-300 focus:border-teal-600 bg-transparent py-3 text-lg placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Destination Question */}
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  Where are you thinking of going? 🌍
                </label>
                <p className="text-gray-500 mb-4">Bali, Brazil, Georgia? Drop a few ideas or just say "not sure"</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {['SOUTH AMERICA', 'SOUTHEAST ASIA', 'NOT SURE'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handlePillSelect('destination', option)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        formData.destination === option
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-teal-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Question */}
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  How long do you want to be away? ⏰
                </label>
                <p className="text-gray-500 mb-4">A few weeks? A few months? Even a rough idea helps</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {['3 MONTHS', '6 MONTHS', '12 MONTHS', 'HELP ME CHOOSE'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handlePillSelect('duration', option)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        formData.duration === option
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-teal-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe Question */}
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  What kind of vibe are you after? 🎒
                </label>
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    'BEACH + CHILL 🏖️',
                    'NATURE + ADVENTURE 🌲',
                    'CITY + CULTURE 🏛️',
                    'PARTY + PEOPLE 🎉',
                    'MIX OF EVERYTHING 🎭'
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handlePillSelect('vibe', option)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        formData.vibe.includes(option)
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-teal-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-teal-800 hover:bg-teal-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  let&apos;s CHAT
                </button>
              </div>
            </form>
          </div>

          {/* Form Illustration */}
          <div className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 w-32 h-32 md:w-40 md:h-40 z-10">
            <Image
              src="images/form-graphic.png"
              alt="Travel form illustration"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LetsChatForm; 
