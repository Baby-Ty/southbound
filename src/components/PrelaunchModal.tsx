'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hourglass, Mail, MessageCircle, X, MapPin, Calendar, Users } from 'lucide-react';

interface PrelaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMAIL = 'email@tylerstewart.co.za';
const WHATSAPP_URL =
  'https://wa.me/27872500972?text=Hi%2C%20I%27m%20interested%20in%20South%20Bound.%20Could%20you%20help%20me%20plan%20a%20trip%20or%20share%20what%27s%20available%3F';

const PrelaunchModal: React.FC<PrelaunchModalProps> = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  if (!isOpen) return null;

  const quickOptions = [
    {
      id: 'custom-trip',
      icon: MapPin,
      title: 'Custom Trip Planning',
      description: 'Design a personalized workation'
    },
    {
      id: 'group-booking',
      icon: Users,
      title: 'Group Booking',
      description: 'Travel with friends or colleagues'
    },
    {
      id: 'specific-dates',
      icon: Calendar,
      title: 'Specific Dates',
      description: 'I have exact travel dates in mind'
    }
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-[61] min-h-full flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-sb-orange-500 via-sb-orange-600 to-sb-orange-500 px-8 py-6 relative">
            <motion.button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-4">
              <motion.div 
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <span className="text-3xl">🚀</span>
              </motion.div>
              <div>
                <motion.h3 
                  className="text-2xl md:text-3xl font-black text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  We're Almost Ready!
                </motion.h3>
                <motion.p 
                  className="text-orange-100 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Your adventure awaits - let's make it happen
                </motion.p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-8">
            {/* Main Message */}
            <motion.div 
              className="bg-gradient-to-br from-sb-teal-50 to-sb-mint-50 rounded-2xl p-6 border border-sb-teal-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-sb-teal-500 flex items-center justify-center flex-shrink-0">
                  <Hourglass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-sb-navy-700 mb-3">
                    Final touches in progress...
                  </h4>
                  <p className="text-sb-navy-600 leading-relaxed">
                    While we perfect our booking system, we're personally helping adventurers like you plan incredible remote work experiences. 
                    Get VIP access and personalized trip planning right now!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="text-lg font-semibold text-sb-navy-700 mb-4 text-center">
                What brings you here today? 🤔
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {quickOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedOption === option.id
                        ? 'border-sb-orange-500 bg-sb-orange-50'
                        : 'border-gray-200 hover:border-sb-orange-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedOption === option.id ? 'bg-sb-orange-500' : 'bg-gray-100'
                      }`}>
                        <option.icon className={`w-5 h-5 ${
                          selectedOption === option.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-sb-navy-700 text-sm mb-1">
                          {option.title}
                        </h5>
                        <p className="text-xs text-sb-navy-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Contact Options */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold text-sb-navy-700 mb-2">
                  Ready to chat? Pick your preferred way:
                </h4>
                <p className="text-sm text-sb-navy-500 mb-6">
                  We'll help you plan the perfect remote work adventure
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={`mailto:${EMAIL}?subject=South Bound Inquiry${selectedOption ? ` - ${quickOptions.find(opt => opt.id === selectedOption)?.title}` : ''}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Email us
                  <span className="ml-2 text-sm opacity-90">📧</span>
                </motion.a>
                
                <motion.a
                  href={`${WHATSAPP_URL}${selectedOption ? `%20I%27m%20interested%20in%20${encodeURIComponent(quickOptions.find(opt => opt.id === selectedOption)?.title || '')}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  WhatsApp
                  <span className="ml-2 text-sm opacity-90">💬</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Trust Signals */}
            <motion.div 
              className="bg-white border-2 border-sb-beige-200 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-sb-orange-500">⚡ 2hrs</div>
                  <div className="text-sm text-sb-navy-600">Average response time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sb-teal-600">🎯 100%</div>
                  <div className="text-sm text-sb-navy-600">Personalized planning</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sb-mint-600">🌟 Free</div>
                  <div className="text-sm text-sb-navy-600">Initial consultation</div>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrelaunchModal;


