import { motion } from 'framer-motion';

type RouteBuilderData = { 
  region: string; 
  lifestyle: string[]; 
  workSetup: string[]; 
  travelStyle: string;
  tripLength?: string;
};

interface SummaryStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onStartOver: () => void;
  onPrevious: () => void;
}

const SummaryStep = ({ data, onUpdate, onStartOver, onPrevious }: SummaryStepProps) => {
  const getRegionName = (regionId: string) => {
    const regions: { [key: string]: string } = {
      'latin-america': 'Latin America',
      'southeast-asia': 'Southeast Asia',
      'europe': 'Europe',
      'surprise-me': 'Surprise Me',
    };
    return regions[regionId] || regionId;
  };

  const getLifestyleNames = (lifestyleIds: string[]) => {
    const lifestyles: { [key: string]: string } = {
      'nature': 'Nature & hiking',
      'foodie': 'Foodie adventures',
      'beach': 'Beach & chill',
      'culture': 'Local culture & festivals',
      'fitness': 'Fitness & wellness',
      'nightlife': 'Nightlife & social vibe',
      'quiet': 'Quiet & focused',
    };
    return lifestyleIds.map(id => lifestyles[id] || id);
  };

  const getWorkSetupNames = (workSetupIds: string[]) => {
    const workSetups: { [key: string]: string } = {
      'fast-internet': 'Fast, reliable internet',
      'quiet-workspace': 'Quiet workspace',
      'coworking': 'Coworking space nearby',
      'second-screen': 'Second screen',
      'frequent-calls': 'Frequent calls',
      'private-office': 'Private office',
      'flexible-schedule': 'Flexible schedule',
      'community': 'Community workspace',
    };
    return workSetupIds.map(id => workSetups[id] || id);
  };

  const getTravelStyleName = (styleId: string) => {
    const styles: { [key: string]: string } = {
      'nomad': 'Nomad',
      'remote-worker': 'Remote Worker',
      'professional-traveler': 'Professional Traveler',
    };
    return styles[styleId] || styleId;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sb-orange-400 to-sb-orange-600 rounded-full shadow-xl"
        >
          <span className="text-xl">✨</span>
        </motion.div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sb-navy-700 tracking-tight mb-1">
            Your Perfect Route is Ready!
          </h2>
          <p className="text-base text-sb-navy-500 max-w-lg mx-auto">
            Customize your duration to see your matches.
          </p>
        </div>
      </div>

      {/* Summary Card - Ticket Style */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative"
      >
        {/* Top Deco Bar */}
        <div className="h-2 bg-gradient-to-r from-sb-orange-400 via-sb-orange-500 to-sb-teal-500" />

        <div className="p-4 space-y-5">
          
          {/* 1. The "What & How" Row */}
          <div className="flex flex-col md:flex-row gap-4">
             {/* Destination - Primary Focus */}
             <div className="flex-1 bg-sb-teal-50 rounded-2xl p-5 border border-sb-teal-100 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                 🌍
               </div>
               <div>
                 <h3 className="text-xs font-bold text-sb-teal-800 uppercase tracking-wider mb-1">
                   Destination
                 </h3>
                 <p className="text-xl font-extrabold text-sb-navy-800 leading-none">
                   {getRegionName(data.region)}
                 </p>
               </div>
             </div>

             {/* Travel Style - Secondary Focus */}
             <div className="flex-1 bg-sb-orange-50 rounded-2xl p-5 border border-sb-orange-100 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                 🎒
               </div>
               <div>
                 <h3 className="text-xs font-bold text-sb-orange-800 uppercase tracking-wider mb-1">
                   Travel Style
                 </h3>
                 <p className="text-xl font-extrabold text-sb-navy-800 leading-none">
                   {getTravelStyleName(data.travelStyle)}
                 </p>
               </div>
             </div>
          </div>

          {/* 2. Duration Selector - The Interaction */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl">📅</span>
              <h3 className="text-sm font-bold text-sb-navy-700 uppercase tracking-wider">
                How long do you want to travel?
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              {['3', '6', '9'].map((length) => (
                <button
                  key={length}
                  onClick={() => onUpdate({ tripLength: length })}
                  className={`py-3 px-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1 relative overflow-hidden ${
                    data.tripLength === length
                      ? 'border-sb-orange-500 bg-white text-sb-orange-600 shadow-md scale-105'
                      : 'border-transparent bg-white text-gray-400 hover:border-gray-200 hover:text-gray-600'
                  }`}
                >
                  <span className="text-xl">{length}</span>
                  <span className="text-xs uppercase tracking-wide opacity-80">Months</span>
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

          {/* 3. Preferences Summary - The Context */}
          <div className="pt-4 border-t border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                   <span>🎯</span> Lifestyle Priorities
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {getLifestyleNames(data.lifestyle || []).map((item, index) => (
                     <span key={index} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-sb-navy-600 text-xs font-medium rounded-lg">
                       {item}
                     </span>
                   ))}
                 </div>
               </div>

               <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                   <span>💻</span> Work Essentials
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {getWorkSetupNames(data.workSetup || []).map((item, index) => (
                     <span key={index} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-sb-navy-600 text-xs font-medium rounded-lg">
                       {item}
                     </span>
                   ))}
                 </div>
               </div>
             </div>
          </div>

        </div>
        
        {/* Bottom Action Bar */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <button
            onClick={onStartOver}
            className="text-gray-500 font-semibold hover:text-sb-navy-700 transition-colors text-xs flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>

          <motion.a
            href={`/trip-options?region=${encodeURIComponent(data.region)}&lifestyle=${encodeURIComponent((data.lifestyle||[]).join(','))}&work=${encodeURIComponent((data.workSetup||[]).join(','))}&style=${encodeURIComponent(data.travelStyle)}&duration=${encodeURIComponent(data.tripLength || '3')}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-3 bg-sb-orange-500 text-white rounded-xl font-bold text-base shadow-lg hover:bg-sb-orange-600 hover:shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            🚀 Build My Trip
          </motion.a>
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-4 py-1 rounded-full text-xs text-gray-400 hover:text-sb-navy-700 hover:bg-white/50 transition-all duration-200"
        >
          <span>←</span>
          <span>Back to Travel Style</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;
