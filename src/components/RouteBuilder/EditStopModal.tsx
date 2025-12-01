import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Edit3,
  Plus,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Search,
  Loader2,
  Trash2,
  LayoutGrid,
  Camera,
  Wand2
} from 'lucide-react';
import { CityPreset, ACCOMMODATION_TYPES, ACCOMMODATION_DETAILS, ACTIVITIES } from '@/lib/cityPresets';
import { StopPlan, HighlightItem } from './EnhancedCityCard';

interface EditStopModalProps {
  stop: StopPlan;
  cityPreset?: CityPreset;
  onClose: () => void;
  onUpdate: (patch: Partial<StopPlan>) => void;
}

type ImageTab = 'library' | 'search' | 'generate';

export const EditStopModal = ({ stop, cityPreset, onClose, onUpdate }: EditStopModalProps) => {
  const [showAccSelector, setShowAccSelector] = useState(false);
  
  // Edit Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  
  // Image Picker State
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<ImageTab>('library');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [genPrompt, setGenPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-search when search tab is opened with a populated query
  useEffect(() => {
    if (activeTab === 'search' && searchQuery.trim() && searchResults.length === 0 && !isSearching) {
      // Small delay to avoid immediate search on tab switch
      const timer = setTimeout(async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
          const { apiUrl } = await import('@/lib/api');
          const res = await fetch(apiUrl(`images-search?query=${encodeURIComponent(searchQuery)}`));
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, searchQuery]);

  // Helpers
  const resetForm = () => {
    setEditTitle("");
    setEditImage("");
    setEditingIndex(null);
    setIsAdding(false);
    setShowImagePicker(false);
    setSearchQuery("");
    setSearchResults([]);
    setGenPrompt("");
    setActiveTab('library'); // Reset to library tab
  };

  const startEdit = (index: number) => {
    const places = stop.highlights.places || [];
    const item = places[index];
    if (!item) return;
    
    const title = typeof item === 'string' ? item : item.title;
    setEditTitle(title);
    // Use user's custom image if available, otherwise use admin default
    const imageUrl = typeof item === 'string' ? '' : (item.imageUrl || '');
    setEditImage(imageUrl);
    setEditingIndex(index);
    setIsAdding(true);
    // Auto-populate search query with highlight title when editing
    setSearchQuery(title);
  };

  const saveHighlight = () => {
    if (!editTitle.trim()) return;
    
    const newItem: HighlightItem = {
      title: editTitle,
      imageUrl: editImage,
      isCustom: true
    };

    const currentPlaces = [...(stop.highlights.places || [])];

    if (editingIndex !== null) {
      currentPlaces[editingIndex] = newItem;
    } else {
      currentPlaces.push(newItem);
    }

    onUpdate({ highlights: { ...stop.highlights, places: currentPlaces } });
    resetForm();
  };

  const removeHighlight = (index: number) => {
    const currentPlaces = stop.highlights.places || [];
    onUpdate({ highlights: { ...stop.highlights, places: currentPlaces.filter((_, i) => i !== index) } });
  };

  const addSuggested = (title: string) => {
    const newItem: HighlightItem = { title, isCustom: false };
    onUpdate({ highlights: { ...stop.highlights, places: [...(stop.highlights.places || []), newItem] } });
  };

  const toggleActivity = (activity: string) => {
    const current = stop.highlights?.activities || [];
    if (current.includes(activity)) {
      onUpdate({ highlights: { ...stop.highlights, activities: current.filter(a => a !== activity) } });
    } else {
      onUpdate({ highlights: { ...stop.highlights, activities: [...current, activity] } });
    }
  };

  // Image Tools
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const { apiUrl } = await import('@/lib/api');
      const res = await fetch(apiUrl(`images-search?query=${encodeURIComponent(searchQuery)}`));
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const { apiUrl } = await import('@/lib/api');
      const res = await fetch(apiUrl('images-generate'), {
        method: 'POST',
        body: JSON.stringify({ prompt: genPrompt + ` in ${stop.city}` }),
      });
      const data = await res.json();
      if (data.url) setEditImage(data.url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentHighlights = Array.isArray(stop.highlights.places) 
    ? stop.highlights.places.map(p => typeof p === 'string' ? { title: p, isCustom: false } as HighlightItem : p)
    : [];
    
  const suggestedHighlights = (cityPreset?.highlights?.places || [])
    .filter(p => !currentHighlights.some(h => h.title === p));

  if (!cityPreset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 font-sans">
      <div className="absolute inset-0 bg-sb-navy-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#faf9f6] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col z-10 overflow-hidden border border-white/50"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-20">
          <div>
            <h3 className="text-xl font-bold text-sb-navy-700 flex items-center gap-2">
              <span className="text-2xl">{cityPreset.flag}</span> 
              Edit {stop.city}
            </h3>
            <p className="text-sm text-gray-500">Customize your experience</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-sb-teal-50 text-sb-teal-700 text-xs font-bold border border-sb-teal-100">
              {stop.weeks} Weeks
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
          </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8">
          
            {/* 1. Quick Settings Row */}
          <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Duration</label>
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onUpdate({ weeks: Math.max(1, stop.weeks - 1) })}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                      >-</button>
                      <span className="font-bold text-lg w-8 text-center">{stop.weeks}</span>
              <button
                        onClick={() => onUpdate({ weeks: Math.min(52, stop.weeks + 1) })}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                      >+</button>
                      <span className="text-sm text-gray-500 ml-1">weeks</span>
            </div>
          </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-sb-orange-300 transition-colors group" onClick={() => setShowAccSelector(true)}>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex justify-between">
                      Accommodation <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                   </label>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sb-orange-100 text-sb-orange-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{stop.highlights.accommodation || "Select Type"}</div>
                        <div className="text-xs text-gray-500">Click to change</div>
                  </div>
                  </div>
                </div>
            </div>

            {/* 2. Highlights Section */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="text-lg font-bold text-sb-navy-700">Trip Highlights</h4>
                    <p className="text-sm text-gray-500">Must-visit spots & experiences</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => { setIsAdding(true); setEditingIndex(null); setEditTitle(""); setEditImage(""); }}
                        className="text-sm font-bold text-sb-teal-600 hover:text-sb-teal-700 flex items-center gap-1 bg-sb-teal-50 px-3 py-1.5 rounded-lg border border-sb-teal-100 hover:border-sb-teal-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add New
                    </button>
                )}
              </div>

              {/* Edit/Add Form */}
              <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white rounded-xl border border-sb-teal-100 shadow-sm overflow-hidden mb-6"
                    >
                        <div className="p-4 space-y-4">
                            <div className="flex gap-3">
                                {/* Image Preview/Add */}
                                <div className="flex-shrink-0">
                                    {editImage ? (
                                        <div 
                                            className="w-24 h-24 rounded-lg relative overflow-hidden group cursor-pointer" 
                                            onClick={() => {
                                              setShowImagePicker(true);
                                              // Auto-populate search query with highlight title when editing image
                                              if (editTitle.trim()) {
                                                setSearchQuery(editTitle.trim());
                                                setActiveTab('search');
                                              }
                                            }}
                                        >
                                            <Image src={editImage} alt="Preview" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Edit3 className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    ) : (
                                    <button 
                                            onClick={() => {
                                              setShowImagePicker(true);
                                              // Auto-populate search query with highlight title when opening image picker
                                              if (editTitle.trim()) {
                                                setSearchQuery(editTitle.trim());
                                                setActiveTab('search');
                                              }
                                            }}
                                            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-sb-teal-400 hover:text-sb-teal-600 hover:bg-sb-teal-50 transition-all"
                        >
                                            <ImageIcon className="w-6 h-6" />
                                            <span className="text-[10px] font-bold uppercase">Add Image</span>
                        </button>
                    )}
                                </div>
                                
                                {/* Inputs */}
                                <div className="flex-1 space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder="What's the highlight? (e.g., Sunset at the Temple)"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent font-medium"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={saveHighlight}
                                            disabled={!editTitle.trim()}
                                            className="px-4 py-2 bg-sb-navy-700 text-white text-sm font-bold rounded-lg hover:bg-sb-navy-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {editingIndex !== null ? 'Update' : 'Add'} Highlight
                                            {editImage && (
                                              <span className="ml-1 text-xs opacity-75">(with image)</span>
                                            )}
                                        </button>
                                    <button 
                                            onClick={resetForm}
                                            className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg"
                                    >
                                            Cancel
                                    </button>
                                    </div>
                                    {editImage && (
                                      <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Image selected - click &quot;{editingIndex !== null ? 'Update' : 'Add'} Highlight&quot; to save
                                      </p>
                                    )}
                                    </div>
                                </div>
                                
                            {/* Image Picker Panel */}
                            {showImagePicker && (
                                <div className="border-t border-gray-100 pt-4 mt-2">
                                    <div className="flex gap-4 border-b border-gray-100 mb-4">
                                        <button 
                                            onClick={() => setActiveTab('library')}
                                            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'library' ? 'border-sb-teal-500 text-sb-teal-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        >
                                            Library
                                        </button>
                                        <button 
                                            onClick={() => {
                                              setActiveTab('search');
                                              // Auto-search if there's a query and no results yet
                                              if (searchQuery.trim() && searchResults.length === 0) {
                                                handleSearch();
                                              }
                                            }}
                                            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'search' ? 'border-sb-teal-500 text-sb-teal-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <Search className="w-3 h-3 inline mr-1" /> Search
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('generate')}
                                            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'generate' ? 'border-sb-teal-500 text-sb-teal-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <Sparkles className="w-3 h-3 inline mr-1" /> AI Generate
                                        </button>
                                    </div>

                                    <div className="min-h-[200px]">
                                        {activeTab === 'library' && (
                                            <div className="grid grid-cols-4 gap-2">
                                                {(cityPreset.imageUrls || [cityPreset.imageUrl]).filter(Boolean).map((url, i) => (
                                                    <button key={i} onClick={() => setEditImage(url!)} className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 ring-sb-teal-400 transition-all">
                                                        <Image src={url!} alt="" fill className="object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'search' && (
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search Unsplash..." 
                                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                    />
                                                    <button onClick={handleSearch} disabled={isSearching} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
                                                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {/* Auto-search when search tab is opened with a query */}
                                                {searchQuery && searchResults.length === 0 && !isSearching && (
                                                  <div className="text-xs text-gray-500 text-center py-2">
                                                    Click search or press Enter to find images
                                                  </div>
                                                )}
                                                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                                    {searchResults.map((img: any) => (
                                                        <button 
                                                            key={img.id} 
                                                            onClick={() => {
                                                                setEditImage(img.url);
                                                                // Optionally close image picker after selection for better UX
                                                                // setShowImagePicker(false);
                                                            }} 
                                                            className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 ring-sb-teal-400 transition-all group"
                                                        >
                                                            <Image src={img.thumb} alt={img.alt} fill className="object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'generate' && (
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Describe the image..." 
                                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                        value={genPrompt}
                                                        onChange={(e) => setGenPrompt(e.target.value)}
                                                    />
                                                    <button onClick={handleGenerate} disabled={isGenerating || !genPrompt} className="px-4 py-2 bg-sb-teal-500 text-white rounded-lg hover:bg-sb-teal-600 disabled:opacity-50 font-bold text-sm flex items-center gap-2">
                                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                                        Generate
                                                    </button>
                                                </div>
                                                {editImage && activeTab === 'generate' && (
                                                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                                                        <Image src={editImage} alt="Generated" fill className="object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

              {/* Existing Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                 {currentHighlights.map((item, i) => (
                    <div key={i} className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-sb-teal-200 transition-all">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                            {item.imageUrl ? (
                                <Image src={item.imageUrl} alt="" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <MapPin className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{item.title}</div>
                            <div className="text-xs text-gray-400">Highlight</div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(i)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-sb-teal-600">
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeHighlight(i)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                 ))}
                 {currentHighlights.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No highlights added yet. Pick some suggestions below!
                </div>
                 )}
              </div>

              {/* Suggestions */}
              {suggestedHighlights.length > 0 && (
                  <div className="mb-8">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Suggested for {stop.city}</label>
                      <div className="flex flex-wrap gap-2">
                          {suggestedHighlights.map(place => (
                <button
                                key={place}
                                onClick={() => addSuggested(place)}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-sb-teal-400 hover:text-sb-teal-700 hover:shadow-sm transition-all flex items-center gap-2 group"
                              >
                                <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-sb-teal-500" />
                                {place}
                </button>
                          ))}
                      </div>
                  </div>
              )}
          </div>

            {/* 3. Activities & Notes */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
          <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Activities</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((activity) => {
                const isSelected = (stop.highlights?.activities || []).includes(activity);
                return (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      isSelected 
                                            ? 'bg-sb-orange-50 border-sb-orange-200 text-sb-orange-600' 
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                                    {activity}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Notes</label>
            <textarea
              rows={3}
              value={stop.highlights.notes}
              onChange={(e) => onUpdate({ highlights: { ...stop.highlights, notes: e.target.value } })}
                        placeholder={stop.highlights.notesHint || "Add notes for your trip designer..."}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent text-sm resize-none bg-gray-50 focus:bg-white transition-colors"
            />
                </div>
            </div>
          </div>
          </div>

        <div className="flex-shrink-0 p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-sb-navy-700 text-white rounded-xl text-sm font-bold hover:bg-sb-navy-800 transition-all shadow-lg hover:shadow-sb-navy-700/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
        </div>

        {/* Accommodation Selector Modal (Nested) */}
        <AnimatePresence>
          {showAccSelector && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-white flex flex-col"
            >
               <div className="flex-shrink-0 p-5 border-b border-gray-100 flex items-center gap-4">
                 <button onClick={() => setShowAccSelector(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                   <X className="w-5 h-5 text-gray-500" />
                 </button>
                 <h3 className="text-lg font-bold text-sb-navy-700">Choose Accommodation</h3>
               </div>
               <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ACCOMMODATION_TYPES.map((type) => {
                      const details = ACCOMMODATION_DETAILS[type] || { 
                        desc: "Comfortable stay.", 
                        img: cityPreset.imageUrl, 
                        pros: ["Comfort", "Location"] 
                      };
                      const isSelected = stop.highlights.accommodation === type;
                      
                      return (
                        <div
                          key={type}
                          className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-sb-orange-500 ring-2 ring-sb-orange-200' : 'border-transparent'}`}
                          onClick={() => {
                            onUpdate({ highlights: { ...stop.highlights, accommodation: type } });
                            setShowAccSelector(false);
                          }}
                        >
                          <div className="h-40 relative">
                            <Image src={details.img} alt={type} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="flex justify-between items-center">
                                <span className="font-bold">{type}</span>
                                {isSelected && <div className="bg-sb-orange-500 rounded-full p-1"><Check className="w-3 h-3" /></div>}
                              </div>
                              <p className="text-xs text-white/80 mt-1">{details.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
