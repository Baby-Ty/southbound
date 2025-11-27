'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Step Components
import RegionStep from '@/components/RouteBuilder/RegionStep';
import LifestyleStep from '@/components/RouteBuilder/LifestyleStep';
import WorkSetupStep from '@/components/RouteBuilder/WorkSetupStep';
import TravelStyleStep from '@/components/RouteBuilder/TravelStyleStep';
import SummaryStep from '@/components/RouteBuilder/SummaryStep';

// Types
export interface RouteBuilderData {
  region: string;
  lifestyle: string[];
  workSetup: string[];
  travelStyle: string;
  tripLength?: string;
  countries?: string[];
}

const RouteBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [routeData, setRouteData] = useState<RouteBuilderData>({
    region: '',
    lifestyle: [],
    workSetup: [],
    travelStyle: '',
    tripLength: '3',
    countries: [],
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
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
      lifestyle: [],
      workSetup: [],
      travelStyle: '',
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
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
          <LifestyleStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <WorkSetupStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <TravelStyleStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <SummaryStep
            data={routeData}
            onUpdate={handleDataUpdate}
            onStartOver={handleStartOver}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-50 via-white to-sb-teal-50 py-8 sm:py-12">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sb-orange-600 bg-sb-orange-100">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-sb-orange-600">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-sb-orange-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sb-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[600px]">
          <div className="p-6 sm:p-10 h-full">
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
                  opacity: { duration: 0.2 }
                }}
                className="h-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteBuilder;
