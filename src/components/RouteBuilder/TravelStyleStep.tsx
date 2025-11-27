import { motion } from 'framer-motion';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-sb-navy-700">
          What's your travel style?
        </h2>
        <p className="text-lg text-sb-navy-500">
          This helps us match your comfort level and accommodation preferences.
        </p>
      </div>

      {/* Travel Style Options */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {travelStyles.map((style) => {
          const isSelected = data.travelStyle === style.id;
          return (
            <motion.button
              key={style.id}
              variants={item}
              onClick={() => handleTravelStyleSelect(style.id)}
              whileHover={{ scale: 1.01, x: 5 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                isSelected
                  ? 'border-sb-orange-500 bg-sb-orange-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-sb-orange-200 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-xl text-3xl ${
                  isSelected ? 'bg-white shadow-sm' : 'bg-sb-teal-50 text-sb-teal-700'
                }`}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-xl font-bold ${isSelected ? 'text-sb-orange-700' : 'text-sb-navy-700'}`}>
                      {style.name}
                    </h3>
                    {isSelected && (
                      <span className="text-sb-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-base text-sb-navy-500 mb-3 font-medium">
                    {style.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {style.features.map((feature, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          isSelected 
                            ? 'bg-sb-orange-100 text-sb-orange-700' 
                            : 'bg-sb-teal-50 text-sb-teal-700'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
          disabled={!data.travelStyle}
          whileHover={{ scale: data.travelStyle ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-200 ${
            data.travelStyle
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Next: Summary
        </motion.button>
      </div>
    </div>
  );
};

export default TravelStyleStep;
