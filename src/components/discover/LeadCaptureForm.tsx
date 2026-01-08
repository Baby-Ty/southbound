'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Check } from 'lucide-react';
import { RegionKey } from '@/lib/cityPresets';
import { VibeKey } from './VibeSelector';
import Link from 'next/link';

interface LeadCaptureFormProps {
  selectedRegions: RegionKey[];
  selectedVibes: VibeKey[];
}

export default function LeadCaptureForm({ selectedRegions, selectedVibes }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [contactType, setContactType] = useState<'email' | 'whatsapp'>('email');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsApp = (phone: string) => {
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!contactValue.trim()) {
      setError(`Please enter your ${contactType === 'email' ? 'email' : 'WhatsApp number'}`);
      return;
    }

    if (contactType === 'email' && !validateEmail(contactValue)) {
      setError('Please enter a valid email address');
      return;
    }

    if (contactType === 'whatsapp' && !validateWhatsApp(contactValue)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const { apiUrl } = await import('@/lib/api');
      
      // Format email for API (WhatsApp uses special format)
      const email = contactType === 'email' ? contactValue : `${contactValue}@whatsapp`;
      
      // Create notes with user selections
      const vibeNames = selectedVibes.map(v => v.replace('-', ' ')).join(', ');
      const notes = `Lead from discover page. Interested in: ${vibeNames}. Regions: ${selectedRegions.join(', ')}`;

      const response = await fetch(apiUrl('routes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email,
          region: selectedRegions.join(','),
          stops: [],
          preferences: {
            vibes: selectedVibes,
            source: 'discover-page',
          },
          notes: notes,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to save your information';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } else {
            const text = await response.text();
            if (text) {
              errorMessage = text;
            }
          }
        } catch (parseError) {
          // If JSON parsing fails, use default error message
          errorMessage = `Server error (${response.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-sb-teal-50 to-sb-mint-50 rounded-3xl p-8 md:p-12 border-2 border-sb-teal-200 text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-sb-teal-500 rounded-full flex items-center justify-center mx-auto"
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>

        <div>
          <h3 className="text-3xl font-extrabold text-sb-navy-900 mb-3">
            Perfect! Let's build your trip 🎉
          </h3>
          <p className="text-lg text-sb-navy-700 mb-2">
            Thanks {name}! Your preferences have been saved.
          </p>
          <p className="text-base text-sb-navy-600">
            Now customize your itinerary, add cities, and make it your own!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/route-builder"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Build Your Full Itinerary</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/popular-trips"
            className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-sb-navy-900 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-200"
          >
            Browse Popular Trips
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-100 shadow-xl"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sb-orange-50 text-sb-orange-600 text-sm font-bold mb-4">
          <span>🎯</span> Almost there!
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-sb-navy-900 mb-3">
          Ready to build your trip?
        </h3>
        <p className="text-base text-sb-navy-600">
          Enter your details to save your preferences and start planning your perfect adventure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-sb-navy-700 mb-2">
            Your name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah Smith"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sb-orange-500 focus:outline-none transition-colors text-sb-navy-900 placeholder:text-gray-400"
          />
        </div>

        {/* Contact Type Toggle */}
        <div>
          <label className="block text-sm font-bold text-sb-navy-700 mb-3">
            How should we reach you?
          </label>
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => setContactType('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                contactType === 'email'
                  ? 'bg-sb-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setContactType('whatsapp')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                contactType === 'whatsapp'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>

          {/* Contact Input */}
          <input
            type={contactType === 'email' ? 'email' : 'tel'}
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={contactType === 'email' ? 'sarah@email.com' : '+27 82 123 4567'}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sb-orange-500 focus:outline-none transition-colors text-sb-navy-900 placeholder:text-gray-400"
          />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-sb-orange-500 to-sb-orange-600 hover:from-sb-orange-600 hover:to-sb-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <span>Shape your remote route</span>
              <span className="text-xl">→</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-center text-sb-navy-400">
          🔒 Your information is safe and secure.
        </p>
      </form>
    </motion.div>
  );
}
