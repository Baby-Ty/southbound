'use client';

import { motion } from 'framer-motion';

interface StepProgressProps {
  step: number; // 0-3: regions, vibes, trips, form
}

export default function StepProgress({ step }: StepProgressProps) {
  // Calculate progress based on step
  // Step 0 (regions): 0%
  // Step 1 (vibes visible): 25%
  // Step 2 (trips visible): 50%
  // Step 3 (form visible): 75%
  // Step 4 (form completed): 100%
  const progress = step * 25;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Progress Track */}
      <div className="h-1 w-full bg-stone-200/50 backdrop-blur-sm">
        {/* Progress Fill */}
        <motion.div 
          className="h-full bg-gradient-to-r from-sb-teal-400 to-sb-orange-400 relative"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Plane Icon */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-lg leading-none transform rotate-90">
            ✈️
          </div>
        </motion.div>
      </div>
    </div>
  );
}
