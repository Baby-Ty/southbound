'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { FAQ } from '@/types/sanity';
import PrelaunchModal from './PrelaunchModal';

interface ContactPageClientProps {
  initialFaqs: FAQ[];
}

const ContactPageClient = ({ initialFaqs }: ContactPageClientProps) => {
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const toggleFaq = (faqId: string) => {
    setSelectedFaq(selectedFaq === faqId ? null : faqId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Show prelaunch modal after form submission
    setPrelaunchOpen(true);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Send us a message anytime",
      contact: "email@tylerstewart.co.za",
      action: "mailto:email@tylerstewart.co.za"
    },
    {
      icon: "💬",
      title: "WhatsApp",
      description: "Chat with us instantly",
      contact: "Start Chat",
      action: "https://wa.me/27872500972?text=Hi%2C%20I%27m%20interested%20in%20South%20Bound.%20Could%20you%20help%20me%20plan%20a%20trip%20or%20share%20what%27s%20available%3F"
    },
    {
      icon: "📞",
      title: "Schedule Call",
      description: "Book a 15-min chat about your trip",
      contact: "Book Call",
      action: "https://calendly.com/tylerstewart147/15mim"
    }
  ];

  // Get the top 4 most relevant FAQs for quick answers
  const quickAnswerFaqs = initialFaqs
    .filter(faq => faq.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-sb-beige-100">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sb-orange-100 via-sb-teal-100 to-sb-mint-100 py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 opacity-20">
            {[...Array(18)].map((_, i) => (
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
              <span className="text-2xl">💬</span>
              <span className="font-semibold text-lg text-sb-navy-700">Get in Touch</span>
              <span className="text-2xl">🤝</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-sb-navy-700 mb-8 leading-tight">
              Let's{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white font-black">Chat</span>
                <span className="absolute inset-0 bg-sb-orange-500 rounded-lg transform -skew-x-12 z-0"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-sb-navy-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Have questions about working remotely from amazing destinations? 
              Need help planning your adventure? We're here to help!
            </p>
            
            <div className="flex justify-center items-center gap-6 text-4xl opacity-80 mb-8">
              {['💬', '🌍', '✈️', '🎯'].map((emoji, index) => (
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
                <span className="text-2xl font-bold text-sb-orange-500">2hr</span>
                <span className="font-medium text-sb-navy-700">Avg Response</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl font-bold text-sb-teal-600">24/7</span>
                <span className="font-medium text-sb-navy-700">Support</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl font-bold text-sb-mint-600">100%</span>
                <span className="font-medium text-sb-navy-700">Helpful</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Answers Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-4">
              Quick Answers
            </h2>
            <p className="text-lg text-sb-navy-600 max-w-2xl mx-auto">
              Check if your question is already answered below. Can&apos;t find what you&apos;re looking for? 
              Use the contact form or reach out directly!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {quickAnswerFaqs.map((faq) => (
              <motion.div
                key={faq._id}
                className="bg-white rounded-xl shadow-medium overflow-hidden hover:shadow-large transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full text-left p-6 focus:outline-none group"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-sb-navy-700 group-hover:text-sb-orange-500 transition-colors duration-300 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div 
                      className="w-6 h-6 bg-sb-orange-100 rounded-full flex items-center justify-center text-sb-orange-600 flex-shrink-0"
                      animate={{ rotate: selectedFaq === faq._id ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: selectedFaq === faq._id ? 'auto' : 0,
                    opacity: selectedFaq === faq._id ? 1 : 0
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
                              normal: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                            },
                            list: {
                              bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                            },
                            listItem: {
                              bullet: ({ children }) => <li className="text-sb-navy-600">{children}</li>,
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.a
              href="/faqs"
              className="inline-flex items-center px-6 py-3 bg-sb-teal-500 hover:bg-sb-teal-600 text-white font-medium rounded-full transition-all duration-300 shadow-medium hover:shadow-large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📚</span>
              <span className="ml-2">View All FAQs</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-sb-navy-600 max-w-2xl mx-auto">
              Choose the way that works best for you. Our team is friendly and ready to help plan your adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div 
                key={index} 
                className="bg-sb-beige-50 rounded-xl p-8 text-center hover:shadow-large transition-all duration-300 border border-sb-beige-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-sb-navy-700 mb-2">{method.title}</h3>
                <p className="text-sb-navy-600 mb-6">{method.description}</p>
                <motion.a 
                  href={method.action}
                  {...(method.action.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-block bg-sb-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sb-orange-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {method.contact}
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-sb-beige-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-sb-navy-600">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-large"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-sb-navy-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sb-beige-300 rounded-lg focus:ring-2 focus:ring-sb-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-sb-navy-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sb-beige-300 rounded-lg focus:ring-2 focus:ring-sb-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-sb-navy-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-sb-beige-300 rounded-lg focus:ring-2 focus:ring-sb-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-sb-navy-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sb-beige-300 rounded-lg focus:ring-2 focus:ring-sb-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-semibold text-sb-navy-700 mb-2">
                What can we help you with? *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-sb-beige-300 rounded-lg focus:ring-2 focus:ring-sb-orange-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select a topic...</option>
                <option value="trip-inquiry">Trip Inquiry</option>
                <option value="booking-help">Booking Help</option>
                <option value="custom-trip">Custom Trip Planning</option>
                <option value="group-travel">Group Travel</option>
                <option value="visa-help">Visa & Travel Requirements</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-semibold text-sb-navy-700 mb-2">
                Tell us more *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Share your travel dreams, questions, or how we can help make your next remote work adventure amazing..."
                className="w-full px-4 py-3 border border-sb-beige-300 rounded-lg focus:ring-2 focus:ring-sb-orange-500 focus:border-transparent resize-none transition-all duration-300"
              ></textarea>
            </div>

            <div className="text-center">
              <motion.button
                type="submit"
                className="bg-sb-orange-500 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-sb-orange-600 transition-all duration-300 shadow-large hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">🚀</span>
                Send Message
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
              <p className="text-sm text-sb-navy-500 mt-4">
                We'll get back to you within 24 hours. Usually much sooner! 🚀
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Response Time Banner */}
      <motion.section 
        className="py-12 bg-gradient-to-r from-sb-orange-500 to-sb-orange-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-2">⚡ Quick Response Time</h3>
            <p className="text-lg opacity-90">
              Average response time: <strong>2 hours</strong> during business hours
            </p>
            <p className="text-sm opacity-75 mt-2">
              Business hours: 9AM - 6PM SAST, Monday - Friday
            </p>
          </div>
        </div>
      </motion.section>

      {/* PrelaunchModal */}
      {prelaunchOpen && (
        <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
      )}
    </div>
  );
};

export default ContactPageClient;
