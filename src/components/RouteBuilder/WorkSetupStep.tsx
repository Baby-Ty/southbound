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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-sb-navy-700">
          What does your ideal work setup look like?
        </h2>
        <p className="text-sb-navy-500">
          Helps us match you with the right coworking and accommodation options.
        </p>
      </div>

      {/* Work Setup Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {workSetupOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleWorkSetupToggle(option.id)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-lg ${
              data.workSetup?.includes(option.id)
                ? 'border-sb-orange-400 bg-sb-orange-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-sb-orange-300 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-1 text-center">
              <span className="text-xl">{option.icon}</span>
              <span className="font-medium text-sb-navy-700 text-xs">
                {option.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!data.workSetup || data.workSetup.length === 0}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
            data.workSetup && data.workSetup.length > 0
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Travel Style
        </button>
      </div>
    </div>
  );
};

export default WorkSetupStep;
