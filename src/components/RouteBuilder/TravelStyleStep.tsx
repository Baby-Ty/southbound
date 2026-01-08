import { motion } from 'framer-motion';

type RouteBuilderData = { 
  region: string; 
  lifestyle: string[]; 
  workSetup: string[]; 
  travelStyle: string;
  tripLength?: string;
  budgetTier?: string;
};

interface TravelStyleStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onStartOver?: () => void;
}

const TravelStyleStep = ({ data, onUpdate, onNext, onPrevious, onStartOver }: TravelStyleStepProps) => {
  const getRegionName = (regionId: string) => {
    const regions: { [key: string]: string } = {
      'latin-america': 'Latin America',
      'southeast-asia': 'Southeast Asia',
      'europe': 'Europe',
      'surprise-me': 'Surprise Me',
    };
    return regions[regionId] || regionId;
  };

  const travelStyles = [
    {
      id: 'nomad',
      name: 'Nomad',
      description: 'Shared living, local spots, and budget-friendly stays',
      icon: '🎒',
      features: ['Hostels & shared spaces', 'Local experiences', 'Budget-conscious'],
    },
    {
      id: 'remote-worker',
      name: 'Remote Worker',
      description: 'Mid-range comfort with a balance of work and play',
      icon: '💼',
      features: ['Private rooms', 'Reliable WiFi', 'Work-life balance'],
    },
    {
      id: 'professional-traveler',
      name: 'Professional',
      description: 'Private stays, premium coworking, and smooth logistics',
      icon: '🏨',
      features: ['Premium accommodations', 'Business facilities', 'Concierge services'],
    },
  ];

  const handleTravelStyleSelect = (styleId: string) => {
    // Travel style IS the budget tier
    const budgetTierMap: { [key: string]: string } = {
      'nomad': 'nomad',
      'remote-worker': 'remote-worker',
      'professional-traveler': 'professional',
    };
    onUpdate({ 
      travelStyle: styleId,
      budgetTier: budgetTierMap[styleId] || styleId
    });
  };

  const handleBuildTrip = () => {
    if (data.travelStyle && data.tripLength) {
      const params = new URLSearchParams({
        region: data.region,
        lifestyle: (data.lifestyle || []).join(','),
        work: (data.workSetup || []).join(','),
        style: data.travelStyle,
        duration: data.tripLength || '3',
        v: '2',
      });
      window.location.href = `/trip-options?${params.toString()}`;
    }
  };

  const canProceed = data.travelStyle && data.tripLength;

  return (
    <div className="space-y-12 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-extrabold text-sb-navy-900 tracking-tight">
            How do you like to travel?
          </h2>
          <p className="text-lg text-sb-navy-500 mt-2">
            This sets your accommodation standard and overall budget.
          </p>
        </motion.div>
      </div>

      <div className="w-full space-y-12">
        {/* Travel Style Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelStyles.map((style) => {
            const isSelected = data.travelStyle === style.id;
            return (
                <motion.button
                key={style.id}
                onClick={() => handleTravelStyleSelect(style.id)}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-8 rounded-[2rem] text-left transition-all duration-300 flex flex-col h-full ${
                    isSelected
                    ? 'bg-sb-navy-900 text-white shadow-2xl shadow-sb-navy-900/20 ring-4 ring-sb-orange-500/20'
                    : 'bg-white text-sb-navy-900 hover:shadow-xl hover:shadow-sb-navy-900/5 border border-gray-100'
                }`}
                >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm ${
                    isSelected ? 'bg-white/10 text-white' : 'bg-sb-teal-50 text-sb-teal-700'
                }`}>
                    {style.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                    {style.name}
                </h3>
                <p className={`text-sm mb-6 leading-relaxed ${isSelected ? 'text-white/70' : 'text-sb-navy-500'}`}>
                    {style.description}
                </p>

                <div className="mt-auto space-y-2">
                    {style.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sb-orange-500' : 'bg-sb-teal-500'}`} />
                        <span className={`text-xs font-semibold ${isSelected ? 'text-white/90' : 'text-sb-navy-600'}`}>
                            {feature}
                        </span>
                    </div>
                    ))}
                </div>

                {isSelected && (
                    <div className="absolute top-6 right-6 text-sb-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                </motion.button>
            );
            })}
        </div>

        {/* Duration Selection */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-50 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sb-orange-400 via-sb-orange-500 to-sb-teal-500" />
            
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-sb-navy-900 mb-2">
                        How long is your journey?
                    </h3>
                    <p className="text-sb-navy-500">
                        We'll craft a perfect itinerary for your timeline.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 md:gap-8">
                {['3', '6', '9'].map((length) => (
                    <button
                    key={length}
                    onClick={() => onUpdate({ tripLength: length })}
                    className={`group relative py-6 px-4 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-1 overflow-hidden ${
                        data.tripLength === length
                        ? 'bg-sb-orange-50 text-sb-orange-600 ring-2 ring-sb-orange-500 shadow-lg scale-105 z-10'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                    >
                        <span className="text-4xl md:text-5xl font-black tracking-tighter">{length}</span>
                        <span className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-90">Months</span>
                        
                        {data.tripLength === length && (
                            <motion.div 
                                layoutId="activeDuration"
                                className="absolute inset-0 bg-sb-orange-500/5 pointer-events-none" 
                            />
                        )}
                    </button>
                ))}
                </div>
            </div>
        </div>
      </div>

      {/* Navigation */}
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
                onClick={handleBuildTrip}
                disabled={!canProceed}
                whileHover={{ scale: canProceed ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-10 py-4 rounded-full font-bold shadow-lg transition-all duration-200 flex items-center gap-3 text-lg ${
                canProceed
                    ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:shadow-sb-orange-500/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
                🚀 Build My Trip
            </motion.button>
        </div>
      </div>
      
      {/* Spacer for fixed bottom bar */}
      <div className="h-24" />
    </div>
  );
};

export default TravelStyleStep;