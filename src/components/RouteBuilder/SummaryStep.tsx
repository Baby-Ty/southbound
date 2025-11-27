import { motion } from 'framer-motion';

type RouteBuilderData = { region: string; lifestyle: string[]; workSetup: string[]; travelStyle: string; };

interface SummaryStepProps {
  data: RouteBuilderData;
  onStartOver: () => void;
  onPrevious: () => void;
}

const SummaryStep = ({ data, onStartOver, onPrevious }: SummaryStepProps) => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sb-orange-400 to-sb-orange-600 rounded-full shadow-xl"
        >
          <span className="text-4xl">✨</span>
        </motion.div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sb-navy-700 tracking-tight mb-2">
            Your Perfect Route is Ready!
          </h2>
          <p className="text-lg text-sb-navy-500 max-w-lg mx-auto">
            We've crafted a personalized travel experience based on your preferences.
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
        <div className="h-3 bg-gradient-to-r from-sb-orange-400 via-sb-orange-500 to-sb-teal-500" />

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Left Column: Main Details */}
           <div className="space-y-6">
             <div className="bg-sb-teal-50 rounded-2xl p-6 border border-sb-teal-100">
               <div className="flex items-center gap-3 mb-2">
                 <span className="text-3xl">🌍</span>
                 <h3 className="text-sm font-bold text-sb-teal-800 uppercase tracking-wider">
                   Destination
                 </h3>
               </div>
               <p className="text-2xl font-extrabold text-sb-navy-800">{getRegionName(data.region)}</p>
             </div>

             <div className="bg-sb-orange-50 rounded-2xl p-6 border border-sb-orange-100">
               <div className="flex items-center gap-3 mb-2">
                 <span className="text-3xl">🎒</span>
                 <h3 className="text-sm font-bold text-sb-orange-800 uppercase tracking-wider">
                   Travel Style
                 </h3>
               </div>
               <p className="text-2xl font-extrabold text-sb-navy-800">{getTravelStyleName(data.travelStyle)}</p>
             </div>
           </div>

           {/* Right Column: Lists */}
           <div className="space-y-6">
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <span className="text-xl">🎯</span>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                   Lifestyle Priorities
                 </h3>
               </div>
               <div className="flex flex-wrap gap-2">
                 {getLifestyleNames(data.lifestyle || []).map((item, index) => (
                   <span key={index} className="px-3 py-1.5 bg-white border border-gray-200 text-sb-navy-700 text-sm font-medium rounded-lg shadow-sm">
                     {item}
                   </span>
                 ))}
               </div>
             </div>

             <div>
               <div className="flex items-center gap-2 mb-3">
                 <span className="text-xl">💻</span>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                   Work Essentials
                 </h3>
               </div>
               <div className="flex flex-wrap gap-2">
                 {getWorkSetupNames(data.workSetup || []).map((item, index) => (
                   <span key={index} className="px-3 py-1.5 bg-white border border-gray-200 text-sb-navy-700 text-sm font-medium rounded-lg shadow-sm">
                     {item}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>
        
        {/* Bottom Action Bar */}
        <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <button
            onClick={onStartOver}
            className="text-gray-500 font-semibold hover:text-sb-navy-700 transition-colors text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>

          <motion.a
            href={`/trip-options?region=${encodeURIComponent(data.region)}&lifestyle=${encodeURIComponent((data.lifestyle||[]).join(','))}&work=${encodeURIComponent((data.workSetup||[]).join(','))}&style=${encodeURIComponent(data.travelStyle)}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-4 bg-sb-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-sb-orange-600 hover:shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            🚀 See Your Matches
          </motion.a>
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-500 hover:text-sb-navy-700 hover:bg-white/50 transition-all duration-200"
        >
          <span>←</span>
          <span>Back to Travel Style</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;

