'use client';

import React from 'react';
import { motion } from 'framer-motion';

const IntroSection = () => {
  return (
    <section className="py-24 bg-stone-50 border-b border-stone-100 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#E86B32]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Connecting Line Animation from Hero */}
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 60 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-0.5 bg-gradient-to-b from-transparent via-[#E86B32]/50 to-[#E86B32]"
          ></motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="text-[#E86B32] font-bold tracking-[0.2em] uppercase text-sm mb-6 block">
            The New Way to Work
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-8 leading-tight">
            You’ve got the remote job. <br/>
            <span className="text-stone-400">Now get the lifestyle.</span>
          </h2>
          <p className="text-xl text-stone-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Planning a multi-month trip while working full-time is a nightmare. 
            Time zones? WiFi speeds? Safe neighborhoods? Community?
          </p>
          <p className="text-xl text-stone-900 font-bold leading-relaxed">
            We sort it all out. You just book your flight and show up.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
