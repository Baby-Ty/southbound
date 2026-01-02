'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Route Builder - Rebuild trigger for GitHub Pages deployment

// Step Components
import RegionStep from '@/components/RouteBuilder/RegionStep';
import TripTemplateStep from '@/components/RouteBuilder/TripTemplateStep';
import BudgetStep from '@/components/RouteBuilder/BudgetStep';

// Types
export interface RouteBuilderData {
  region: string;
  template?: string;
  workSetup: string[];
  travelStyle: string;
  budgetTier?: string;
}

const RouteBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [routeData, setRouteData] = useState<RouteBuilderData>({
    region: '',
    template: undefined,
    workSetup: [],
    travelStyle: 'remote-worker',
    budgetTier: undefined,
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDataUpdate = (stepData: Partial<RouteBuilderData>) => {
    setRouteData(prev => ({ ...prev, ...stepData }));
  };

  const handleStartOver = () => {
    setDirection(-1);
    setCurrentStep(1);
    setRouteData({
      region: '',
      template: undefined,
      workSetup: [],
      travelStyle: 'remote-worker',
      budgetTier: undefined,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeeTrip = () => {
    if (routeData.region && routeData.template && routeData.budgetTier) {
      const params = new URLSearchParams({
        region: routeData.region,
        template: routeData.template,
        work: (routeData.workSetup || []).join(','),
        style: routeData.travelStyle,
        budgetTier: routeData.budgetTier,
        v: '3', // Version 3 for template-based flow
      });
      window.location.href = `/trip-options?${params.toString()}`;
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegionStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <TripTemplateStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <BudgetStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onPrevious={handlePrevious}
            onSeeTrip={handleSeeTrip}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-4 sm:py-8">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sb-orange-100/30 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-sb-teal-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center min-h-[calc(100vh-4rem)]">
        
        {/* Minimal Progress Steps */}
        <div className="mb-8 flex items-center gap-3">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            
            return (
              <div key={i} className="flex items-center gap-3">
                <motion.div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    isActive ? 'w-12 bg-sb-orange-500' : 
                    isCompleted ? 'w-2.5 bg-sb-navy-200' : 'w-2.5 bg-gray-100'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Content Area - No more box, just open layout */}
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RouteBuilder;