import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, MapPin, Loader2 } from 'lucide-react';
import { getTemplatesForRegion, TripTemplate } from '@/lib/tripTemplates';
import { RegionKey } from '@/lib/cityPresets';
import { CITY_PRESETS } from '@/lib/cityPresets';

interface RouteBuilderData {
  region: string;
  template?: string;
  workSetup: string[];
  travelStyle: string;
}

interface TripTemplateStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface TemplateCardProps {
  template: TripTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onDiscover: (e: React.MouseEvent) => void;
}

const TemplateModal = ({ template, onClose }: { template: TripTemplate; onClose: () => void }) => {
  const regionPresets = CITY_PRESETS[template.region] || [];
  const cityDetails = template.presetCities.map(cityName => {
    const preset = regionPresets.find(p => p.city === cityName);
    return preset ? { name: cityName, flag: preset.flag, country: preset.country } : null;
  }).filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-sb-navy-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col border border-white/20"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Header Image */}
          <div className="relative h-64 w-full shrink-0">
            <Image
              src={template.imageUrl}
              alt={template.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/90 via-sb-navy-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                {template.name}
              </h2>
              <p className="text-white/90 font-medium text-lg max-w-lg">{template.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-sb-navy-900 uppercase tracking-wider mb-3">Cities Included</h3>
              <div className="space-y-3">
                {cityDetails.map((city, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{city?.flag}</span>
                    <div>
                      <div className="font-bold text-sb-navy-900">{city?.name}</div>
                      <div className="text-sm text-gray-600">{city?.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-sb-navy-900 uppercase tracking-wider mb-3">Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-sb-teal-50 text-sb-teal-700 rounded-lg text-sm font-medium border border-sb-teal-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-sb-orange-50/50 p-5 rounded-2xl border border-sb-orange-100">
              <h4 className="font-bold text-sb-orange-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                📅 Duration
              </h4>
              <p className="text-lg font-bold text-sb-orange-700 mb-1">{template.presetCities.length} months</p>
              <p className="text-xs text-sb-orange-600 leading-relaxed">One month per city, perfect for deep immersion.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TemplateCard = ({ template, isSelected, onSelect, onDiscover }: TemplateCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const regionPresets = CITY_PRESETS[template.region] || [];
  const cityFlags = template.presetCities
    .map(cityName => regionPresets.find(p => p.city === cityName)?.flag)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative flex flex-col bg-white rounded-[1.5rem] overflow-hidden cursor-pointer h-full transition-all duration-300 ${
        isSelected
          ? 'shadow-2xl shadow-sb-orange-500/20 ring-4 ring-sb-orange-500/20'
          : 'shadow-lg shadow-sb-navy-900/5 hover:shadow-2xl hover:shadow-sb-navy-900/10 border border-transparent hover:border-gray-100'
      }`}
    >
      {/* Image Section - Balanced aspect to fit above fold but fill space */}
      <div className="relative aspect-[1.2/1] w-full overflow-hidden">
        <Image
          src={template.imageUrl}
          alt={template.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Gradient Overlay - Stronger for readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-90'}`} />

        {/* Selected State Ring */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-[4px] border-sb-orange-500 z-20 rounded-[1.5rem]"
            />
          )}
        </AnimatePresence>

        {/* Top Content */}
        <div className="absolute top-0 left-0 w-full p-5 z-10 flex justify-end items-start">
          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDiscover(e);
            }}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-sb-navy-900 transition-all border border-white/20"
          >
            <Info size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Content Container */}
        <div className="absolute bottom-0 left-0 w-full p-5 z-10 text-white flex flex-col gap-2.5">
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold tracking-tight drop-shadow-md leading-tight">
              {template.name}
            </h3>
            <p className="text-white/80 text-xs font-medium leading-relaxed line-clamp-2 drop-shadow-sm">
              {template.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {/* City Flags Preview */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {cityFlags.map((flag, idx) => (
                  <span key={idx} className="text-lg filter drop-shadow-sm">{flag}</span>
                ))}
                {template.presetCities.length > 3 && (
                  <span className="text-[10px] font-bold text-white/60 bg-white/10 px-1.5 py-0.5 rounded-md border border-white/5">
                    +{template.presetCities.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {template.tags.slice(0, 1).map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Selected Indicator */}
          {isSelected && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute bottom-5 right-5 bg-sb-orange-500 text-white p-2 rounded-full shadow-xl z-20 border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TripTemplateStep = ({ data, onUpdate, onNext, onPrevious }: TripTemplateStepProps) => {
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<TripTemplate | null>(null);
  const [templates, setTemplates] = useState<TripTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const region = data.region as RegionKey;

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        const fetchedTemplates = await getTemplatesForRegion(region);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        // Fallback to sync version
        const { getTemplatesForRegionSync } = await import('@/lib/tripTemplates');
        setTemplates(getTemplatesForRegionSync(region));
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [region]);

  const handleTemplateSelect = (templateId: string) => {
    onUpdate({ template: templateId });
  };

  return (
    <div className="space-y-10 flex flex-col items-center pb-20">
      {/* Header - More compact to stay above fold */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sb-navy-900 tracking-tight">
            Choose your adventure style
          </h2>
          <p className="text-lg text-sb-navy-500 mt-2">
            Pick a trip template that matches your vibe.
          </p>
        </motion.div>
      </div>

      {/* Template Cards Grid - Horizontal aspect to stay above fold */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-sb-navy-500">
          <p>No templates available for this region.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={data.template === template.id}
              onSelect={() => handleTemplateSelect(template.id)}
              onDiscover={() => setSelectedTemplateDetails(template)}
            />
          ))}
        </div>
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
            onClick={data.template ? onNext : undefined}
            disabled={!data.template}
            whileHover={{ scale: data.template ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-200 flex items-center gap-2 text-base ${
              data.template
                ? 'bg-sb-navy-900 text-white hover:bg-sb-navy-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            Next: Work Preferences
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Template Details Modal */}
      {selectedTemplateDetails && (
        <TemplateModal 
          template={selectedTemplateDetails} 
          onClose={() => setSelectedTemplateDetails(null)} 
        />
      )}
    </div>
  );
};

export default TripTemplateStep;

