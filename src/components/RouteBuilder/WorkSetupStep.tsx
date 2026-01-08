import { motion } from 'framer-motion';

type RouteBuilderData = { region: string; template?: string; workSetup: string[]; travelStyle: string; };

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

  const hasSelection = data.workSetup && data.workSetup.length > 0;

  return (
    <div className="space-y-12 max-w-5xl mx-auto flex flex-col items-center pb-24">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sb-navy-900 tracking-tight">
            Work hard, play hard.
          </h2>
          <p className="text-lg text-sb-navy-500 mt-2">
            What do you need to be productive on the road?
          </p>
        </motion.div>
      </div>

      {/* Work Setup Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {workSetupOptions.map((option) => {
          const isSelected = data.workSetup?.includes(option.id);
          return (
            <motion.button
              key={option.id}
              onClick={() => handleWorkSetupToggle(option.id)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-[1.2/1] p-6 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 group ${
                isSelected
                  ? 'bg-sb-teal-500 text-white shadow-xl shadow-sb-teal-500/20 ring-4 ring-sb-teal-500/20'
                  : 'bg-white text-sb-navy-700 hover:shadow-xl hover:shadow-sb-navy-900/5 hover:bg-gray-50'
              }`}
            >
              <span className="text-4xl sm:text-5xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                {option.icon}
              </span>
              <span className={`font-bold text-sm sm:text-base leading-tight ${isSelected ? 'text-white' : 'text-sb-navy-900'}`}>
                {option.name}
              </span>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
                onClick={onPrevious}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sb-navy-600 hover:bg-gray-100 transition-colors font-bold text-sm"
            >
                <span className="text-lg">←</span>
                <span>Back</span>
            </button>

            <motion.button
                onClick={hasSelection ? onNext : undefined}
                disabled={!hasSelection}
                whileHover={{ scale: hasSelection ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-200 flex items-center gap-2 text-base ${
                hasSelection
                    ? 'bg-sb-navy-900 text-white hover:bg-sb-navy-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
                Next: Travel Style
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WorkSetupStep;