'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  duration: string;
  vibe: string[];
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
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
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sb-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💬</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Let&apos;s Chat</h2>
              <p className="text-gray-600 text-sm">Tell us about your dream adventure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Let&apos;s start with your name 👋"
                className="w-full border-2 border-gray-300 focus:border-sb-teal-500 bg-transparent py-3 px-4 text-lg placeholder-gray-400 focus:outline-none transition-colors rounded-lg"
                required
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
                className="w-full border-2 border-gray-300 focus:border-sb-teal-500 bg-transparent py-3 px-4 text-lg placeholder-gray-400 focus:outline-none transition-colors rounded-lg"
                required
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
                className="w-full border-2 border-gray-300 focus:border-sb-teal-500 bg-transparent py-3 px-4 text-lg placeholder-gray-400 focus:outline-none transition-colors rounded-lg"
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
                        ? 'border-sb-teal-500 bg-sb-teal-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-sb-teal-500'
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
                        ? 'border-sb-teal-500 bg-sb-teal-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-sb-teal-500'
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
                        ? 'border-sb-teal-500 bg-sb-teal-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-sb-teal-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-sb-teal-600 hover:bg-sb-teal-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Let&apos;s Chat! 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
