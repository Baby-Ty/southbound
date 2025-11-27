'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PreFooterCTA() {
  return (
    <section className="py-32 bg-[#E86B32] text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-orange-50 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Ready for your next adventure?</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Stop dreaming. <br className="hidden md:block" />
            <span className="text-orange-100">Start packing.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-orange-50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Your desk is ready in Bali. Your community is waiting in Cape Town. 
            All you have to do is click.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/route-builder"
              className="group inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-[#E86B32] font-bold rounded-full text-xl transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:bg-stone-50"
            >
              Build your itinerary now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <p className="mt-8 text-sm text-orange-200/80 font-medium tracking-wide uppercase">
            No login required to start planning
          </p>
        </motion.div>
      </div>
    </section>
  );
}

