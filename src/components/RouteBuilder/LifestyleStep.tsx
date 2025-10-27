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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-sb-navy-700">
          What kind of lifestyle are you after?
        </h2>
        <p className="text-sb-navy-500">
          Pick a few that sound like you.
        </p>
      </div>

      {/* Lifestyle Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {lifestyleOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleLifestyleToggle(option.id)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-lg ${
              data.lifestyle?.includes(option.id)
                ? 'border-sb-orange-400 bg-sb-orange-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-sb-orange-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{option.icon}</span>
              <span className="font-medium text-sb-navy-700 text-sm">
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
          disabled={!data.lifestyle || data.lifestyle.length === 0}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
            data.lifestyle && data.lifestyle.length > 0
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Work Setup
        </button>
      </div>
    </div>
  );
};

export default LifestyleStep;
