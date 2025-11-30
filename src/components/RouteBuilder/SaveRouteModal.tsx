'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MessageCircle, Loader2, Check } from 'lucide-react';

interface SaveRouteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (routeId: string) => void;
  routeData: {
    region: string;
    stops: any[];
    preferences: {
      lifestyle: string[];
      workSetup: string[];
      travelStyle: string;
    };
    notes?: string;
  };
}

export default function SaveRouteModal({
  open,
  onClose,
  onSuccess,
  routeData,
}: SaveRouteModalProps) {
  const [name, setName] = useState('');
  const [contactType, setContactType] = useState<'email' | 'whatsapp'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [routeId, setRouteId] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateWhatsApp = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    // Should have 10-15 digits
    return digits.length >= 10 && digits.length <= 15;
  };

  const handleSubmit = async () => {
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
      const response = await fetch(apiUrl('routes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: contactType === 'email' ? contactValue : `${contactValue}@whatsapp`,
          region: routeData.region,
          stops: routeData.stops,
          preferences: routeData.preferences,
          notes: routeData.notes || '',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save route');
      }

      const { route } = await response.json();
      setRouteId(route.id);
      setSuccess(true);

      // Send email or WhatsApp link
      const routeUrl = `${window.location.origin}/route/${route.id}`;
      
      if (contactType === 'email') {
        // Call API to send email
        try {
          await fetch(apiUrl('routes/send-link'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              routeId: route.id,
              email: contactValue,
              routeUrl,
            }),
          });
        } catch (err) {
          // Email sending failed, but route is saved
          console.error('Failed to send email:', err);
        }
      } else {
        // For WhatsApp, open WhatsApp with the link
        const phone = contactValue.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Hi! Your South Bound route is ready. View it here: ${routeUrl}`)}`;
        // Open in new tab (user can close it)
        window.open(whatsappUrl, '_blank');
      }

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess(route.id);
        onClose();
        // Reset form
        setName('');
        setContactValue('');
        setSuccess(false);
        setRouteId('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          {!success ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-sb-navy-700">Save Your Route</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Enter your name and email or WhatsApp number to receive a link to your saved route. You can come back anytime to view or edit it.
              </p>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Contact Type Selector */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => {
                    setContactType('whatsapp');
                    setContactValue('');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    contactType === 'whatsapp'
                      ? 'bg-white text-sb-navy-700 shadow-sm'
                      : 'text-gray-600 hover:text-sb-navy-700'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    setContactType('email');
                    setContactValue('');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    contactType === 'email'
                      ? 'bg-white text-sb-navy-700 shadow-sm'
                      : 'text-gray-600 hover:text-sb-navy-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>

              {/* Contact Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {contactType === 'email' ? 'Email Address' : 'WhatsApp Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type={contactType === 'email' ? 'email' : 'tel'}
                  value={contactValue}
                  onChange={(e) => {
                    setContactValue(e.target.value);
                    setError('');
                  }}
                  placeholder={
                    contactType === 'email'
                      ? 'your@email.com'
                      : '+1 234 567 8900'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name.trim() || !contactValue.trim()}
                  className="flex-1 px-4 py-3 bg-sb-teal-500 text-white rounded-xl font-medium hover:bg-sb-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Route
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-sb-navy-700 mb-2">
                Route Saved Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                {contactType === 'email'
                  ? 'Check your email for a link to your route.'
                  : 'You will receive a WhatsApp message with your route link.'}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

