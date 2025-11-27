import { motion } from 'framer-motion';

type RouteBuilderData = { region: string; lifestyle: string[]; workSetup: string[]; travelStyle: string; };

interface WorkSetupStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const WorkSetupStep = ({ data, onUpdate, onNext, onPrevious }: WorkSetupStepProps) => {
  const workSetupOptions = [
    { id: 'fast-internet', name: 'Fast, reliable internet', icon: '⚡' },
    { id: 'quiet-workspace', name: 'Quiet workspace', icon: '🧘‍♂️' },
    { id: 'coworking', name: 'Coworking space nearby', icon: '☕' },
    { id: 'second-screen', name: 'Second screen', icon: '💻' },
    { id: 'frequent-calls', name: 'Frequent calls', icon: '☎️' },
    { id: 'private-office', name: 'Private office', icon: '🏠' },
    { id: 'flexible-schedule', name: 'Flexible schedule', icon: '⏰' },
    { id: 'community', name: 'Community workspace', icon: '🤝' },
  ];

  const handleWorkSetupToggle = (setupId: string) => {
    const currentWorkSetup = data.workSetup || [];
    const updatedWorkSetup = currentWorkSetup.includes(setupId)
      ? currentWorkSetup.filter(id => id !== setupId)
      : [...currentWorkSetup, setupId];
    
    onUpdate({ workSetup: updatedWorkSetup });
  };

  const handleNext = () => {
    if (data.workSetup && data.workSetup.length > 0) {
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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-sb-navy-700">
          What does your ideal work setup look like?
        </h2>
        <p className="text-base text-sb-navy-500">
          Helps us match you with the right coworking and accommodation options.
        </p>
      </div>

      {/* Work Setup Options */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {workSetupOptions.map((option) => {
          const isSelected = data.workSetup?.includes(option.id);
          return (
            <motion.button
              key={option.id}
              variants={item}
              onClick={() => handleWorkSetupToggle(option.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-300 h-full flex flex-col items-center justify-center text-center space-y-2 min-h-[110px] ${
                isSelected
                  ? 'border-sb-orange-500 bg-sb-orange-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-sb-orange-200 hover:shadow-lg'
              }`}
            >
              <span className="text-3xl mb-1">{option.icon}</span>
              <span className={`font-semibold text-sm leading-tight ${isSelected ? 'text-sb-orange-700' : 'text-sb-navy-700'}`}>
                {option.name}
              </span>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 text-sb-orange-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-6 py-3 rounded-full text-gray-500 hover:bg-gray-100 hover:text-sb-navy-700 transition-all duration-200 font-medium"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <motion.button
          onClick={handleNext}
          disabled={!data.workSetup || data.workSetup.length === 0}
          whileHover={{ scale: data.workSetup && data.workSetup.length > 0 ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-200 ${
            data.workSetup && data.workSetup.length > 0
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Next: Travel Style
        </motion.button>
      </div>
    </div>
  );
};

export default WorkSetupStep;
