import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Wifi, 
  Sun, 
  Cloud, 
  Star,
  ChevronDown,
  GripVertical,
  Bed,
  Coffee,
  Edit3,
  Replace,
  Trash2,
  Check,
  X,
  Plus
} from 'lucide-react';
import { CityPreset, ACCOMMODATION_TYPES, ACTIVITIES } from '@/lib/cityPresets';

export interface StopPlan {
  id: string;
  city: string;
  country: string;
  weeks: number;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  highlights: {
    places: string[];
    accommodation: string;
    activities: string[];
    notes: string;
    notesHint?: string;
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

  const toggleActivity = (activity: string) => {
    const current = stop.highlights.activities;
    if (current.includes(activity)) {
      onUpdate({ 
        highlights: { 
          ...stop.highlights, 
          activities: current.filter(a => a !== activity) 
        } 
      });
    } else {
      onUpdate({ 
        highlights: { 
          ...stop.highlights, 
          activities: [...current, activity] 
        } 
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
        isEditing ? 'border-sb-orange-400 ring-2 ring-sb-orange-100 shadow-xl z-10' : 'border-gray-200 hover:shadow-xl'
      }`}
    >
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0">
          <Image
            src={cityPreset.imageUrl}
            alt={`${stop.city}, ${stop.country}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg font-bold text-sb-navy-700">
              {index + 1}
            </div>
            <div 
              {...dragHandleProps}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white cursor-grab active:cursor-grabbing hover:bg-white/30 transition-colors"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs text-white font-medium">
              {getWeatherIcon(cityPreset.weather.climate)}
              <span>{cityPreset.weather.avgTemp}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs text-white font-medium">
              <Wifi className="w-3 h-3" />
              <span>{cityPreset.internetSpeed}</span>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2 shadow-black/50 drop-shadow-md">
                <span>{cityPreset.flag}</span>
                {stop.city}
              </h3>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{stop.country}</span>
                <span className="mx-1">•</span>
                <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm border border-white/10 text-xs">
                  {stop.weeks} weeks
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{cityPreset.nomadScore}/10</span>
              </div>
              <div className="text-xs text-white/70">Nomad Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-3 border-b border-gray-100 divide-x divide-gray-100 bg-gray-50/50">
        <div className="p-3 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Budget</div>
          <div className="text-sb-navy-700 font-bold text-sm">{cityPreset.costs.monthlyTotal}</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Best Time</div>
          <div className="text-sb-navy-700 font-bold text-sm">{cityPreset.weather.bestMonths}</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Vibe</div>
          <div className="text-sb-navy-700 font-bold text-sm truncate px-2">
            {stop.tags[0]}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {/* Edit Mode Form */}
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Duration (Weeks)</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={stop.weeks}
                  onChange={(e) => onUpdate({ weeks: Math.max(1, Math.min(52, parseInt(e.target.value) || 1)) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-sm"
                  onDragStart={preventDrag}
                  draggable
                  onDrag={(e) => { e.preventDefault(); e.stopPropagation(); }}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Accommodation</label>
                <div className="relative">
                  <select
                    value={stop.highlights.accommodation}
                    onChange={(e) => onUpdate({ highlights: { ...stop.highlights, accommodation: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-sm appearance-none bg-white"
                    onDragStart={preventDrag}
                  >
                    <option value="" disabled>Select type</option>
                    {ACCOMMODATION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Activities (Select Multiple)</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => {
                  const isSelected = stop.highlights.activities.includes(activity);
                  return (
                    <button
                      key={activity}
                      onClick={(e) => { e.stopPropagation(); toggleActivity(activity); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected 
                          ? 'bg-sb-orange-100 border-sb-orange-200 text-sb-orange-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      onDragStart={preventDrag}
                    >
                      {activity} {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Notes</label>
              <textarea
                rows={3}
                value={stop.highlights.notes}
                onChange={(e) => onUpdate({ highlights: { ...stop.highlights, notes: e.target.value } })}
                placeholder={stop.highlights.notesHint}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-sm resize-none"
                onDragStart={preventDrag}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onStopEdit}
                className="px-4 py-2 bg-sb-navy-700 text-white rounded-lg text-sm font-medium hover:bg-sb-navy-800 transition-colors flex items-center gap-2"
                onDragStart={preventDrag}
              >
                <Check className="w-4 h-4" />
                Done Editing
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* View Mode Highlights */}
            <div className="space-y-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Accommodation</div>
                  <div className="text-sm text-gray-700 font-medium">{stop.highlights.accommodation}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Coworking & Cafes</div>
                  <div className="text-sm text-gray-700 font-medium">{cityPreset.highlights.notesHint}</div>
                </div>
              </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-100 space-y-4 pb-2">
                    {/* Cost Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Monthly Cost Breakdown</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Accommodation</span>
                            <span className="font-medium text-gray-900">{cityPreset.costs.accommodation}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Coworking</span>
                            <span className="font-medium text-gray-900">{cityPreset.costs.coworking}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Meals & Lifestyle</span>
                            <span className="font-medium text-gray-900">{cityPreset.costs.meals}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Top Activities</h4>
                      <div className="flex flex-wrap gap-2">
                        {stop.highlights.activities.map((activity, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* User Notes */}
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                       <div className="flex justify-between items-center mb-2">
                         <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Your Notes</h4>
                         <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-xs text-yellow-600 hover:text-yellow-800 font-medium underline">
                           Edit
                         </button>
                       </div>
                       <p className="text-sm text-yellow-800 italic">
                         {stop.highlights.notes || "No notes yet..."}
                       </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onSwap(); }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-sb-navy-700 transition-colors"
                  title="Change City"
                  onDragStart={preventDrag}
                >
                  <Replace className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-sb-navy-700 transition-colors"
                  title="Edit Details"
                  onDragStart={preventDrag}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Stop"
                  onDragStart={preventDrag}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="flex items-center gap-1 text-sm font-medium text-sb-orange-600 hover:text-sb-orange-700 transition-colors"
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
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedCityCard;
