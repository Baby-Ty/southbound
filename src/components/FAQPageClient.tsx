'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { FAQ } from '@/types/sanity';

interface FAQPageClientProps {
  initialFaqs: FAQ[];
}

const FAQPageClient = ({ initialFaqs }: FAQPageClientProps) => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const categoryTitles = {
    general: 'General',
    booking: 'Booking',
    travel: 'Travel',
    payment: 'Payment',
    cancellation: 'Cancellation',
  };

  const categoryIcons = {
    general: '🌟',
    booking: '📅',
    travel: '✈️',
    payment: '💳',
    cancellation: '↩️',
  };

  // Filter FAQs based on selected category
  const filteredFaqs = selectedCategory === 'all' 
    ? initialFaqs 
    : initialFaqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-sb-beige-100">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sb-mint-100 via-sb-teal-100 to-sb-beige-100 py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-sb-orange-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <span className="text-2xl">❓</span>
              <span className="font-semibold text-lg text-sb-navy-700">Help Center</span>
              <span className="text-2xl">💡</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-sb-navy-700 mb-8 leading-tight">
              Frequently Asked{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white font-black">Questions</span>
                <span className="absolute inset-0 bg-sb-orange-500 rounded-lg transform -skew-x-12 z-0"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-sb-navy-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Everything you need to know about working remotely from amazing destinations. 
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </p>
            
            <div className="flex justify-center items-center gap-6 text-4xl opacity-80 mb-8">
              {['🤔', '💡', '✅', '🚀'].map((emoji, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                  className="hover:scale-125 transition-transform duration-300"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl font-bold text-sb-orange-500">{initialFaqs.length}</span>
                <span className="font-medium text-sb-navy-700">FAQs</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl font-bold text-sb-teal-600">5</span>
                <span className="font-medium text-sb-navy-700">Categories</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl font-bold text-sb-mint-600">24/7</span>
                <span className="font-medium text-sb-navy-700">Support</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Category Filter */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-sb-navy-700 mb-4">
                Browse by Category
              </h2>
              <div className="w-16 h-1 bg-sb-orange-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <motion.button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-sb-orange-500 text-white shadow-medium'
                    : 'bg-white text-sb-navy-600 hover:bg-sb-orange-50 border border-sb-orange-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">🌟</span>
                All Questions
              </motion.button>
              
              {Object.entries(categoryTitles).map(([key, title]) => (
                <motion.button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === key
                      ? 'bg-sb-orange-500 text-white shadow-medium'
                      : 'bg-white text-sb-navy-600 hover:bg-sb-orange-50 border border-sb-orange-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{categoryIcons[key as keyof typeof categoryIcons]}</span>
                  {title}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Content - Centered */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs
                    .sort((a, b) => a.order - b.order)
                    .map((faq) => (
                      <motion.div
                        key={faq._id}
                        className="bg-white rounded-xl shadow-medium overflow-hidden hover:shadow-large transition-all duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <button
                          onClick={() => toggleFaq(faq._id)}
                          className="w-full text-left p-6 focus:outline-none group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                              <h3 className="text-lg font-semibold text-sb-navy-700 group-hover:text-sb-orange-500 transition-colors duration-300">
                                {faq.question}
                              </h3>
                              {faq.category !== 'general' && (
                                <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-sb-teal-50 text-sb-teal-700">
                                  <span className="mr-1">{categoryIcons[faq.category as keyof typeof categoryIcons]}</span>
                                  {categoryTitles[faq.category as keyof typeof categoryTitles]}
                                </span>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <motion.div 
                                className="w-8 h-8 bg-sb-orange-100 rounded-full flex items-center justify-center text-sb-orange-600"
                                animate={{ rotate: openFaq === faq._id ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </motion.div>
                            </div>
                          </div>
                        </button>
                        
                        <motion.div
                          initial={false}
                          animate={{
                            height: openFaq === faq._id ? 'auto' : 0,
                            opacity: openFaq === faq._id ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <div className="border-t border-sb-beige-200 pt-4">
                              <div className="text-sb-navy-600 leading-relaxed">
                                <PortableText
                                  value={faq.answer}
                                  components={{
                                    block: {
                                      normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                    },
                                    list: {
                                      bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                                    },
                                    listItem: {
                                      bullet: ({ children }) => <li className="text-sb-navy-600">{children}</li>,
                                    },
                                    marks: {
                                      link: ({ children, value }) => (
                                        <a
                                          href={value.href}
                                          className="text-sb-orange-500 underline hover:text-sb-orange-600"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {children}
                                        </a>
                                      ),
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤔</div>
                    <h3 className="text-xl font-semibold text-sb-navy-700 mb-2">No FAQs found</h3>
                    <p className="text-sb-navy-600">Try selecting a different category or check back later.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Still have questions section - centered below FAQs */}
            <motion.div 
              className="mt-16 bg-white rounded-xl shadow-medium p-8 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-xl">
                <Image
                  src="images/faq-image.png"
                  alt="FAQ illustration"
                  fill
                  className="object-contain"
                  priority={false}
                />
              </div>
              <h3 className="text-xl font-semibold text-sb-navy-700 mb-3">Still have questions?</h3>
              <p className="text-sb-navy-600 mb-6 leading-relaxed">
                Our team is here to help you plan your perfect remote work adventure.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-medium rounded-full transition-all duration-300 shadow-medium hover:shadow-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>💬</span>
                <span className="ml-2">Get in Touch</span>
              </motion.a>
            </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-sb-teal-50 to-sb-orange-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🚀</span>
            <h2 className="text-2xl md:text-3xl font-bold text-sb-navy-700">Ready to Start Your Adventure?</h2>
            <span className="text-3xl">🌍</span>
          </div>
          <p className="text-lg text-sb-navy-600 mb-8 leading-relaxed">
            Join other South Africans making remote work more exciting and way less routine.
          </p>
          <motion.a
            href="/popular-trips"
            className="inline-flex items-center px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🗺️</span>
            <span className="ml-2">Explore Destinations</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default FAQPageClient;
