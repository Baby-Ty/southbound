import { RouteBuilderData } from '@/app/route-builder/page';

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

  const generateSummary = () => {
    const region = getRegionName(data.region);
    const lifestyle = getLifestyleNames(data.lifestyle || []);
    const workSetup = getWorkSetupNames(data.workSetup || []);
    const travelStyle = getTravelStyleName(data.travelStyle);

    return `You're feeling ${region} vibes, into ${lifestyle.slice(0, 2).join(' and ')}${lifestyle.length > 2 ? ' and more' : ''}, need ${workSetup.slice(0, 2).join(' and ')}${workSetup.length > 2 ? ' and more' : ''}, and travel ${travelStyle} style. Sounds like your kind of trip.`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-sb-navy-700">
          You're all set — here's your route vibe ✈️
        </h2>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-sb-teal-50 to-sb-orange-50 rounded-2xl p-6 border border-sb-teal-200">
        <div className="text-center space-y-4">
          <div className="text-4xl">✈️</div>
          <p className="text-sb-navy-600 leading-relaxed">
            {generateSummary()}
          </p>
        </div>
      </div>

      {/* Selected Options Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Region */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-sb-navy-700 mb-2 flex items-center">
            <span className="mr-2">🌍</span>
            Region
          </h3>
          <p className="text-sb-navy-600 text-sm">{getRegionName(data.region)}</p>
        </div>

        {/* Travel Style */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-sb-navy-700 mb-2 flex items-center">
            <span className="mr-2">🎒</span>
            Travel Style
          </h3>
          <p className="text-sb-navy-600 text-sm">{getTravelStyleName(data.travelStyle)}</p>
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-sb-navy-700 mb-2 flex items-center">
            <span className="mr-2">🎯</span>
            Lifestyle
          </h3>
          <div className="flex flex-wrap gap-1">
            {getLifestyleNames(data.lifestyle || []).map((item, index) => (
              <span key={index} className="px-2 py-0.5 bg-sb-orange-100 text-sb-orange-700 text-xs rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Work Setup */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-sb-navy-700 mb-2 flex items-center">
            <span className="mr-2">💻</span>
            Work Setup
          </h3>
          <div className="flex flex-wrap gap-1">
            {getWorkSetupNames(data.workSetup || []).map((item, index) => (
              <span key={index} className="px-2 py-0.5 bg-sb-teal-100 text-sb-teal-700 text-xs rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <a
          href={`/trip-options?region=${encodeURIComponent(data.region)}&lifestyle=${encodeURIComponent((data.lifestyle||[]).join(','))}&work=${encodeURIComponent((data.workSetup||[]).join(','))}&style=${encodeURIComponent(data.travelStyle)}`}
          className="px-6 py-3 bg-sb-orange-500 text-white rounded-full font-semibold hover:bg-sb-orange-600 hover:scale-105 transition-all duration-200 shadow-lg text-center"
        >
          Show Me Trip Options
        </a>
        <button className="px-6 py-3 bg-sb-teal-500 text-white rounded-full font-semibold hover:bg-sb-teal-600 hover:scale-105 transition-all duration-200 shadow-lg">
          Save My Route
        </button>
        <button
          onClick={onStartOver}
          className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        >
          Start Over
        </button>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-3">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        >
          <span>←</span>
          <span>Back to Travel Style</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;
