import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Wifi, 
  Sun, 
  Cloud, 
  GripVertical,
  Bed,
  Coffee,
  Edit3,
  Replace,
  Trash2,
  Check,
  AlertTriangle,
  Sparkles,
  Image as ImageIcon2,
  ChevronDown,
  Utensils,
  Smile,
  Waves,
  Wand2
} from 'lucide-react';
import { CityPreset } from '@/lib/cityPresets';

export interface HighlightItem {
  title: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface StopPlan {
  id: string;
  city: string;
  country: string;
  weeks: number;
  weeksEdited?: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  highlights: {
    places: HighlightItem[];
    accommodation: string;
    activities: string[];
    notes: string;
    notesHint?: string;
    overview?: string;
  };
}

interface EnhancedCityCardProps {
  stop: StopPlan;
  cityPreset?: CityPreset;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onStopEdit: () => void;
  onRemove: () => void;
  onSwap: () => void;
  onUpdate: (patch: Partial<StopPlan>) => void;
  dragHandleProps?: any;
}

const EnhancedCityCard = ({
  stop,
  cityPreset,
  index,
  isEditing,
  onEdit,
  onStopEdit,
  onRemove,
  onSwap,
  onUpdate,
  dragHandleProps
}: EnhancedCityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reset to primary image (index 0) when cityPreset changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
  }, [cityPreset?.city, cityPreset?.imageUrl]);

  // Get current image from rotation - always starts with primary (index 0)
  const getCurrentImage = () => {
    if (!cityPreset) return '';
    // If we have multiple images, use the rotation
    if (cityPreset.imageUrls && cityPreset.imageUrls.length > 0) {
      // Ensure we're using a valid index (always start at 0 = primary)
      const safeIndex = currentImageIndex % cityPreset.imageUrls.length;
      return cityPreset.imageUrls[safeIndex];
    }
    // Fallback to primary imageUrl (which is always the first image)
    return cityPreset.imageUrl;
  };

  // Rotate to next image on click - cycles through all images
  const rotateImage = () => {
    if (cityPreset && cityPreset.imageUrls && cityPreset.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % cityPreset.imageUrls!.length;
        return nextIndex;
      });
    }
  };

  if (!cityPreset) return null;

  const getWeatherIcon = (climate: string) => {
    switch (climate) {
      case 'tropical': return <Sun className="w-4 h-4 text-orange-500" />;
      case 'mediterranean': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'temperate': return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'dry': return <Sun className="w-4 h-4 text-orange-400" />;
      default: return <Sun className="w-4 h-4" />;
    }
  };

  const preventDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Ensure places is an array (handle migration/bad data)
  const currentHighlights = Array.isArray(stop.highlights.places) 
    ? stop.highlights.places.map(p => typeof p === 'string' ? { title: p, isCustom: false } as HighlightItem : p)
    : [];

  // Helper to generate default overview if empty
  const getDefaultOverview = () => {
    const vibe = stop?.tags?.[0] || "Balanced";
    return `You chose ${vibe} and Calm. ${stop.city} gives you incredible street food, lots of cafés, and a laid-back city that is perfect for focused work.`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-white rounded-[2px] shadow-card transition-all duration-300 texture-paper overflow-visible ${
        isEditing ? 'ring-4 ring-sb-orange-200 z-10 rotate-0' : 'hover:shadow-card-hover hover:rotate-0'
      }`}
      style={{
        transform: isEditing ? 'none' : `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`,
      }}
    >
      {/* Tape Effect */}
      {!isEditing && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm z-20 border-l border-r border-white/60"></div>
      )}

      {/* Hero Section - Taller & Premium */}
      <div 
        className="relative h-80 overflow-hidden rounded-t-[2px] bg-gray-200 group-hover:h-[21rem] transition-all duration-500 cursor-pointer border-b border-gray-200 shadow-inner"
        onClick={rotateImage}
        title={cityPreset.imageUrls && cityPreset.imageUrls.length > 1 ? `Click to rotate images (${currentImageIndex + 1}/${cityPreset.imageUrls.length})` : undefined}
      >
        <div className="absolute inset-0">
          {!imageError ? (
            <Image
              key={getCurrentImage()} // Force re-render on image change
              src={getCurrentImage()}
              alt={`${stop.city}, ${stop.country}`}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 saturate-[.95] group-hover:saturate-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 2}
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sb-navy-100 text-sb-navy-300">
               <MapPin className="w-12 h-12 opacity-20" />
            </div>
          )}
        </div>
        
        {/* Image rotation indicator */}
        {cityPreset.imageUrls && cityPreset.imageUrls.length > 1 && (
          <div className="absolute bottom-24 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <ImageIcon2 className="w-3 h-3" />
            <span>
              {currentImageIndex === 0 ? '⭐ ' : ''}
              {currentImageIndex + 1}/{cityPreset.imageUrls.length}
            </span>
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/90 via-sb-navy-900/20 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-dashed border-gray-300 transform -rotate-6">
              <span className="font-handwritten font-bold text-sb-navy-700 text-lg">#{index + 1}</span>
            </div>
            <div 
              {...dragHandleProps}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white/80 cursor-grab active:cursor-grabbing hover:bg-white/30 transition-colors border border-white/10 hover:border-white/20 hover:text-white"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex gap-2">
             <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="px-2 py-1.5 rounded-sm bg-white/90 backdrop-blur-sm shadow-sm flex items-center gap-1 text-xs text-sb-navy-500 font-bold border border-white/50 hover:text-sb-orange-600 transition-colors"
              title="Edit Card"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Title Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 text-white z-10">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-5xl font-bold mb-2 flex items-center gap-3 shadow-black/50 drop-shadow-md tracking-tighter font-serif">
                <span className="text-4xl filter drop-shadow-md">{cityPreset.flag}</span>
                {stop.city}
              </h3>
              <div className="flex items-center gap-3 text-white/90 text-sm font-medium">
                <span className="flex items-center gap-1.5 font-handwritten text-lg"><MapPin className="w-4 h-4 text-sb-orange-400" /> {stop.country}</span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                 <div className="flex items-center gap-2">
                    {getWeatherIcon(cityPreset.weather.climate)}
                    <span className="font-handwritten text-sm">{cityPreset.weather.avgTemp}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Stats Grid */}
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 border-t border-white/10 bg-black/20 backdrop-blur-md divide-x divide-white/10">
            <div className="p-4 text-center group/stat hover:bg-white/10 transition-colors cursor-default">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 group-hover/stat:text-sb-orange-300 transition-colors">Budget</div>
              <div className="text-white font-bold text-sm">
                {cityPreset.costs.monthlyTotal.includes('R') 
                  ? cityPreset.costs.monthlyTotal 
                  : `R${(parseInt(cityPreset.costs.monthlyTotal.replace(/[^0-9-]/g, '').split('-')[0]) * 18).toLocaleString()}`}
              </div>
            </div>
            <div className="p-4 text-center group/stat hover:bg-white/10 transition-colors cursor-default">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 group-hover/stat:text-sb-teal-300 transition-colors">Best Time</div>
              <div className="text-white font-bold text-sm">{cityPreset.weather.bestMonths}</div>
            </div>
            <div className="p-4 text-center group/stat hover:bg-white/10 transition-colors cursor-default">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 group-hover/stat:text-sb-orange-300 transition-colors">Vibe</div>
              <div className="text-white font-bold text-sm truncate px-2">
                {stop?.tags?.[0] || "Balanced"}
              </div>
            </div>
        </div>
      </div>

      {/* Overview Section - New Layout */}
      <div className="px-6 py-5 bg-white border-b border-sb-beige-200 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
             {/* Left: Overview Text */}
             <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                   <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide flex items-center gap-2">
                     <Sparkles className="w-3.5 h-3.5 text-sb-orange-500" /> Overview
                   </h4>
                   <button 
                     className="text-xs text-sb-teal-600 hover:text-sb-teal-700 font-medium flex items-center gap-1 px-2 py-1 rounded-full hover:bg-sb-teal-50 transition-colors"
                     onClick={(e) => { e.stopPropagation(); /* TODO: Implement AI Polish */ }}
                    >
                     <Wand2 className="w-3 h-3" /> Polish with AI
                   </button>
                </div>
                <div className="relative group/overview">
                    <textarea
                      value={stop.highlights.overview !== undefined ? stop.highlights.overview : getDefaultOverview()}
                      onChange={(e) => onUpdate({ highlights: { ...stop.highlights, overview: e.target.value } })}
                      className="w-full text-sm text-sb-navy-700 leading-relaxed bg-transparent border border-transparent hover:border-sb-beige-200 focus:border-sb-orange-300 rounded-lg p-2 -ml-2 focus:ring-0 resize-none transition-all"
                      rows={4}
                      placeholder="Describe why this stop fits the trip..."
                    />
                    <Edit3 className="absolute top-2 right-2 w-3 h-3 text-sb-navy-300 opacity-0 group-hover/overview:opacity-100 transition-opacity pointer-events-none" />
                </div>
             </div>

             {/* Right: Action Buttons */}
             <div className="flex flex-col gap-2 md:w-[200px] shrink-0">
                {/* Accommodation */}
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Trigger Modal */ }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-sb-orange-50/30 border border-sb-orange-100/50 hover:bg-sb-orange-50 hover:border-sb-orange-200 transition-all text-left group w-full"
                >
                   <div className="w-8 h-8 rounded-lg bg-white text-sb-orange-600 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                     <Bed className="w-4 h-4" />
                   </div>
                   <div className="min-w-0">
                     <div className="text-[10px] font-bold text-sb-navy-500 uppercase tracking-wide mb-0.5">Accommodation</div>
                     <div className="text-xs font-bold text-sb-navy-700 truncate">{stop.highlights.accommodation || 'Select type'}</div>
                   </div>
                </button>

                {/* Coworking */}
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Trigger Modal */ }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-sb-teal-50/30 border border-sb-teal-100/50 hover:bg-sb-teal-50 hover:border-sb-teal-200 transition-all text-left group w-full"
                >
                   <div className="w-8 h-8 rounded-lg bg-white text-sb-teal-600 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                     <Coffee className="w-4 h-4" />
                   </div>
                   <div className="min-w-0">
                     <div className="text-[10px] font-bold text-sb-navy-500 uppercase tracking-wide mb-0.5">Working Vibe</div>
                     <div className="text-xs font-bold text-sb-navy-700 truncate">{cityPreset.highlights.notesHint || 'Select vibe'}</div>
                   </div>
                </button>
             </div>
          </div>
      </div>

      {/* Trip Highlights - View Mode */}
      <div className="px-5 py-4 border-b border-sb-beige-200 bg-white">
          <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide mb-3">Trip Highlights</h4>
          <div className="grid grid-cols-3 gap-3">
            {currentHighlights.map((place, i) => (
              <div key={i} className="group cursor-pointer relative">
                <div className={`aspect-[4/3] rounded-lg bg-gradient-to-br from-sb-beige-100 via-sb-orange-50/50 to-sb-teal-50 mb-1.5 relative overflow-hidden border border-sb-orange-100/50 pattern-dots`}>
                  {/* Image or Placeholder */}
                  {place.imageUrl ? (
                    <Image 
                      src={place.imageUrl} 
                      alt={place.title} 
                      fill 
                      className="object-cover" 
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-6 h-6 text-sb-orange-400/60 mx-auto mb-1" />
                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-sb-orange-300 to-transparent mx-auto"></div>
                      </div>
                    </div>
                  )}
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/10 to-transparent"></div>
                  
                  {/* Edit Pencil Overlay */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-sb-navy-600 hover:text-sb-orange-600 z-10 hover:scale-110"
                    title="Edit Highlight"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[10px] font-medium text-sb-navy-600 group-hover:text-sb-orange-600 truncate transition-colors">
                  {place.title}
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pb-2">
                {/* Cost Breakdown */}
                <div className="bg-sb-beige-50 rounded-xl p-4 border border-sb-beige-200">
                  <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide mb-3">Monthly Cost Breakdown</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-sb-navy-600">Accommodation</span>
                        <span className="font-medium text-sb-navy-700">{cityPreset.costs.accommodation}</span>
                      </div>
                      <div className="h-1.5 w-full bg-sb-beige-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sb-orange-400 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-sb-navy-600">Coworking</span>
                        <span className="font-medium text-sb-navy-700">{cityPreset.costs.coworking}</span>
                      </div>
                      <div className="h-1.5 w-full bg-sb-beige-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sb-teal-400 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-sb-navy-600">Meals & Lifestyle</span>
                        <span className="font-medium text-sb-navy-700">{cityPreset.costs.meals}</span>
                      </div>
                      <div className="h-1.5 w-full bg-sb-beige-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sb-orange-300 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide mb-2">Top Activities</h4>
                  <div className="flex flex-wrap gap-2">
                    {(stop.highlights?.activities || []).map((activity, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-sb-beige-50 border border-sb-orange-100 text-xs font-medium text-sb-navy-600">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Notes */}
                <div className="mt-4 pt-4 border-t border-sb-beige-200">
                  <label className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide block mb-2">Your notes for this stop</label>
                  <div className="relative group/notes texture-paper">
                    <textarea
                      value={stop.highlights.notes}
                      onChange={(e) => onUpdate({ highlights: { ...stop.highlights, notes: e.target.value } })}
                      placeholder="Add a note..."
                      rows={2}
                      className="w-full bg-sb-beige-50/80 hover:bg-sb-beige-100 border border-sb-orange-100/50 rounded-lg px-3 py-2 text-sm text-sb-navy-700 placeholder:text-sb-navy-400/60 focus:ring-2 focus:ring-sb-orange-300/50 focus:bg-sb-beige-100 transition-all resize-none relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute right-2 bottom-2 pointer-events-none z-20">
                      <Edit3 className="w-3 h-3 text-sb-orange-500/60 opacity-50 group-hover/notes:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 mt-2">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onSwap(); }}
              className="p-2 rounded-lg hover:bg-sb-beige-100 text-sb-navy-500 hover:text-sb-navy-700 transition-colors"
              title="Change City"
              onDragStart={preventDrag}
            >
              <Replace className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-2 rounded-lg hover:bg-red-50 text-sb-navy-400 hover:text-red-500 transition-colors"
              title="Remove Stop"
              onDragStart={preventDrag}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="flex items-center gap-1 text-sm font-medium text-sb-orange-600 hover:text-sb-orange-700 hover:bg-sb-orange-50/50 px-2 py-1 rounded-md transition-all"
            onDragStart={preventDrag}
          >
            {isExpanded ? 'Less Details' : 'More Details'}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedCityCard;
