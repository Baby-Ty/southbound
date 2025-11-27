import { motion } from 'framer-motion';

type RouteBuilderData = { region: string; lifestyle: string[]; workSetup: string[]; travelStyle: string; };

interface LifestyleStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const LifestyleStep = ({ data, onUpdate, onNext, onPrevious }: LifestyleStepProps) => {
  const lifestyleOptions = [
    { id: 'nature', name: 'Nature & hiking', icon: '🌿' },
    { id: 'foodie', name: 'Foodie adventures', icon: '🍜' },
    { id: 'beach', name: 'Beach & chill', icon: '🏖️' },
    { id: 'culture', name: 'Local culture & festivals', icon: '🎭' },
    { id: 'fitness', name: 'Fitness & wellness', icon: '💪' },
    { id: 'nightlife', name: 'Nightlife & social vibe', icon: '🎶' },
    { id: 'quiet', name: 'Quiet & focused', icon: '💻' },
  ];

  const handleLifestyleToggle = (lifestyleId: string) => {
    const currentLifestyle = data.lifestyle || [];
    const updatedLifestyle = currentLifestyle.includes(lifestyleId)
      ? currentLifestyle.filter(id => id !== lifestyleId)
      : [...currentLifestyle, lifestyleId];
    
    onUpdate({ lifestyle: updatedLifestyle });
  };

  const handleNext = () => {
    if (data.lifestyle && data.lifestyle.length > 0) {
      onNext();
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-sb-navy-700">
          What kind of lifestyle are you after?
        </h2>
        <p className="text-lg text-sb-navy-500">
          Pick a few that sound like you.
        </p>
      </div>

      {/* Lifestyle Options */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {lifestyleOptions.map((option) => {
          const isSelected = data.lifestyle?.includes(option.id);
          return (
            <motion.button
              key={option.id}
              variants={item}
              onClick={() => handleLifestyleToggle(option.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 h-full flex items-center space-x-4 ${
                isSelected
                  ? 'border-sb-orange-500 bg-sb-orange-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-sb-orange-200 hover:shadow-lg'
              }`}
            >
              <span className="text-4xl">{option.icon}</span>
              <span className={`font-semibold text-lg ${isSelected ? 'text-sb-orange-700' : 'text-sb-navy-700'}`}>
                {option.name}
              </span>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 text-sb-orange-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-100">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-6 py-3 rounded-full text-gray-500 hover:bg-gray-100 hover:text-sb-navy-700 transition-all duration-200 font-medium"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <motion.button
          onClick={handleNext}
          disabled={!data.lifestyle || data.lifestyle.length === 0}
          whileHover={{ scale: data.lifestyle && data.lifestyle.length > 0 ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-200 ${
            data.lifestyle && data.lifestyle.length > 0
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Next: Work Setup
        </motion.button>
      </div>
    </div>
  );
};

export default LifestyleStep;
