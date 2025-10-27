type RouteBuilderData = { region: string; lifestyle: string[]; workSetup: string[]; travelStyle: string; };

interface TravelStyleStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const TravelStyleStep = ({ data, onUpdate, onNext, onPrevious }: TravelStyleStepProps) => {
  const travelStyles = [
    {
      id: 'nomad',
      name: 'Nomad',
      description: 'Shared living, local spots, and budget-friendly stays',
      icon: '🎒',
      features: ['Hostels & shared spaces', 'Local experiences', 'Budget-conscious', 'Community-focused'],
    },
    {
      id: 'remote-worker',
      name: 'Remote Worker',
      description: 'Mid-range comfort with a balance of work and play',
      icon: '💼',
      features: ['Private rooms', 'Reliable WiFi', 'Work-life balance', 'Comfortable stays'],
    },
    {
      id: 'professional-traveler',
      name: 'Professional Traveler',
      description: 'Private stays, premium coworking, and smooth logistics',
      icon: '🏨',
      features: ['Premium accommodations', 'Business facilities', 'Concierge services', 'Luxury options'],
    },
  ];

  const handleTravelStyleSelect = (styleId: string) => {
    onUpdate({ travelStyle: styleId });
  };

  const handleNext = () => {
    if (data.travelStyle) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-sb-navy-700">
          What's your travel style?
        </h2>
        <p className="text-sb-navy-500">
          This helps us match your comfort level and accommodation preferences.
        </p>
      </div>

      {/* Travel Style Options */}
      <div className="space-y-3">
        {travelStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => handleTravelStyleSelect(style.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-lg ${
              data.travelStyle === style.id
                ? 'border-sb-orange-400 bg-sb-orange-50 shadow-md scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-sb-orange-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{style.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-sb-navy-700 mb-1">
                  {style.name}
                </h3>
                <p className="text-sm text-sb-navy-500 mb-2">
                  {style.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {style.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-sb-teal-100 text-sb-teal-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
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
          disabled={!data.travelStyle}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
            data.travelStyle
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Summary
        </button>
      </div>
    </div>
  );
};

export default TravelStyleStep;
