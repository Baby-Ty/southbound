import { motion } from 'framer-motion';

type RouteBuilderData = { 
  region: string; 
  template?: string;
  workSetup: string[]; 
  travelStyle: string;
  budgetTier?: string;
};

interface BudgetStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onPrevious: () => void;
  onSeeTrip: () => void;
}

const BudgetStep = ({ data, onUpdate, onPrevious, onSeeTrip }: BudgetStepProps) => {
  const budgetTiers = [
    {
      id: 'nomad',
      name: 'Nomad',
      description: 'Shared living, local spots, and budget-friendly stays',
      icon: '🎒',
      features: ['Hostels & shared spaces', 'Local experiences', 'Budget-conscious'],
      priceRange: 'R15,000 - R25,000/month',
    },
    {
      id: 'remote-worker',
      name: 'Remote Worker',
      description: 'Mid-range comfort with a balance of work and play',
      icon: '💼',
      features: ['Private rooms', 'Reliable WiFi', 'Work-life balance'],
      priceRange: 'R25,000 - R45,000/month',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Private stays, premium coworking, and smooth logistics',
      icon: '🏨',
      features: ['Premium accommodations', 'Business facilities', 'Concierge services'],
      priceRange: 'R45,000 - R70,000/month',
    },
  ];

  const workSetupOptions = [
    { id: 'fast-internet', name: 'Strong internet', icon: '⚡' },
    { id: 'quiet-workspace', name: 'Quiet space', icon: '🤫' },
    { id: 'coworking', name: 'Coworking nearby', icon: '🧑‍💻' },
    { id: 'frequent-calls', name: 'Call friendly', icon: '📞' },
  ];

  const handleBudgetTierSelect = (tierId: string) => {
    // Map tier IDs to travel style format
    const travelStyleMap: { [key: string]: string } = {
      'nomad': 'nomad',
      'remote-worker': 'remote-worker',
      'professional': 'professional-traveler',
    };
    onUpdate({ 
      budgetTier: tierId,
      travelStyle: travelStyleMap[tierId] || tierId
    });
  };

  const handleWorkSetupToggle = (setupId: string) => {
    const currentWorkSetup = data.workSetup || [];
    const updatedWorkSetup = currentWorkSetup.includes(setupId)
      ? currentWorkSetup.filter(id => id !== setupId)
      : [...currentWorkSetup, setupId];
    
    onUpdate({ workSetup: updatedWorkSetup });
  };

  const canProceed = data.budgetTier && data.template;

  return (
    <div className="space-y-8 max-w-5xl mx-auto flex flex-col items-center pb-24">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sb-navy-900 tracking-tight">
            What's your travel style?
          </h2>
          <p className="text-base text-sb-navy-500 mt-1">
            Choose your budget tier, then tell us what you need to work productively.
          </p>
        </motion.div>
      </div>

      {/* Budget Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {budgetTiers.map((tier) => {
          const isSelected = data.budgetTier === tier.id;
          return (
            <motion.button
              key={tier.id}
              onClick={() => handleBudgetTierSelect(tier.id)}
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
                {tier.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2">
                {tier.name}
              </h3>
              <p className={`text-sm mb-4 leading-relaxed ${isSelected ? 'text-white/70' : 'text-sb-navy-500'}`}>
                {tier.description}
              </p>

              <div className={`text-xs font-bold mb-4 ${isSelected ? 'text-white/90' : 'text-sb-orange-600'}`}>
                {tier.priceRange}
              </div>

              <div className="mt-auto space-y-2">
                {tier.features.map((feature, index) => (
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

      {/* Work Preferences Section */}
      {data.budgetTier && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full space-y-5 pt-4 border-t border-gray-50"
        >
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-sb-navy-400 uppercase tracking-widest">
              Work Setup
            </p>
            <p className="text-sm text-sb-navy-600">
              What do you need to be productive on the road?
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto w-full">
            {workSetupOptions.map((option) => {
              const isSelected = data.workSetup?.includes(option.id);
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleWorkSetupToggle(option.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 border-2 ${
                    isSelected
                      ? 'bg-sb-navy-900 border-sb-orange-500 shadow-lg shadow-sb-navy-900/20'
                      : 'bg-white border-gray-100 hover:border-sb-navy-200 hover:shadow-md'
                  }`}
                >
                  <span className={`text-2xl sm:text-3xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale-[0.5] group-hover:grayscale-0'}`}>
                    {option.icon}
                  </span>
                  <span className={`font-bold text-[10px] sm:text-xs leading-tight tracking-tight uppercase ${isSelected ? 'text-white' : 'text-sb-navy-700'}`}>
                    {option.name}
                  </span>
                  
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 bg-sb-orange-500 text-white p-1 rounded-full shadow-md z-10 border-2 border-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

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
            onClick={canProceed ? onSeeTrip : undefined}
            disabled={!canProceed}
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={`px-10 py-4 rounded-full font-bold shadow-lg transition-all duration-200 flex items-center gap-3 text-lg ${
              canProceed
                ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:shadow-sb-orange-500/30'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            🚀 See My Trip
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;

