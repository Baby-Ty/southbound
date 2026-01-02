'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Bed, Wifi, Coffee, Utensils, Waves, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AccommodationType {
  name: string;
  description: string;
  images: string[];
  amenities: string[];
}

interface AccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  currentAccommodation?: string;
  accommodationTypes?: { [key: string]: AccommodationType };
  onSelectAccommodation?: (type: string) => void;
}

const DEFAULT_ACCOMMODATION_TYPES: { [key: string]: AccommodationType } = {
  hostel: {
    name: 'Hostel',
    description: 'Budget-friendly shared accommodation perfect for solo travelers and digital nomads. Expect dorm rooms, common areas, and a social atmosphere.',
    images: [],
    amenities: ['Shared kitchen', 'Common areas', 'WiFi', 'Laundry facilities', 'Social events'],
  },
  apartment: {
    name: 'Apartment',
    description: 'Private apartments with full amenities. Perfect for longer stays with kitchen, workspace, and privacy.',
    images: [],
    amenities: ['Private kitchen', 'Workspace', 'WiFi', 'Washing machine', 'Full privacy'],
  },
  hotel: {
    name: 'Hotel',
    description: 'Comfortable hotel rooms with daily housekeeping. Great for short stays with all amenities included.',
    images: [],
    amenities: ['Daily cleaning', 'Room service', 'WiFi', 'Gym access', 'Concierge'],
  },
  coliving: {
    name: 'Coliving Space',
    description: 'Modern coliving spaces designed for remote workers. Includes coworking areas, community events, and work-friendly amenities.',
    images: [],
    amenities: ['Coworking space', 'Community events', 'High-speed WiFi', 'Kitchen access', 'Networking'],
  },
};

const AMENITY_ICONS: { [key: string]: any } = {
  'WiFi': Wifi,
  'High-speed WiFi': Wifi,
  'Shared kitchen': Utensils,
  'Private kitchen': Utensils,
  'Common areas': Coffee,
  'Coworking space': Coffee,
  'Laundry facilities': Waves,
  'Washing machine': Waves,
  'Workspace': Bed,
  'Daily cleaning': Bed,
  'Room service': Bed,
  'Gym access': Bed,
  'Concierge': MapPin,
  'Social events': Coffee,
  'Community events': Coffee,
  'Networking': Coffee,
  'Full privacy': Bed,
};

export default function AccommodationModal({
  isOpen,
  onClose,
  cityName,
  currentAccommodation,
  accommodationTypes = {},
  onSelectAccommodation,
}: AccommodationModalProps) {
  const [selectedType, setSelectedType] = useState<string>(
    currentAccommodation || Object.keys(accommodationTypes)[0] || 'apartment'
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  // Merge default types with city-specific types
  const allTypes = { ...DEFAULT_ACCOMMODATION_TYPES, ...accommodationTypes };
  const selectedAccommodation = allTypes[selectedType] || allTypes['apartment'];
  const availableTypes = Object.keys(allTypes);

  const currentImage = selectedAccommodation.images[currentImageIndex] || null;
  const hasMultipleImages = selectedAccommodation.images.length > 1;

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAccommodation.images.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedAccommodation.images.length) % selectedAccommodation.images.length);
    }
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setCurrentImageIndex(0);
    if (onSelectAccommodation) {
      onSelectAccommodation(type);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-sb-navy-700">Accommodation in {cityName}</h2>
            <p className="text-sm text-stone-500 mt-1">Choose an accommodation type to see details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Left: Type Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">Accommodation Types</h3>
              {availableTypes.map((type) => {
                const accType = allTypes[type];
                return (
                  <button
                    key={type}
                    onClick={() => handleSelectType(type)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedType === type
                        ? 'border-sb-orange-500 bg-sb-orange-50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedType === type ? 'bg-sb-orange-500 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        <Bed className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold ${selectedType === type ? 'text-sb-navy-700' : 'text-stone-700'}`}>
                          {accType.name}
                        </div>
                        {selectedType === type && (
                          <div className="text-xs text-sb-orange-600 mt-0.5">Selected</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Details */}
            <div className="md:col-span-2 space-y-4">
              {/* Image Gallery */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                {currentImage ? (
                  <>
                    <Image
                      src={currentImage}
                      alt={selectedAccommodation.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                          {currentImageIndex + 1} / {selectedAccommodation.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                    <div className="text-center">
                      <Bed className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-sb-navy-700 mb-2">{selectedAccommodation.name}</h3>
                <p className="text-stone-600 leading-relaxed">{selectedAccommodation.description}</p>
              </div>

              {/* What to Expect */}
              <div>
                <h4 className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-3">What to Expect</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAccommodation.amenities.map((amenity, idx) => {
                    const Icon = AMENITY_ICONS[amenity] || Bed;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-sb-beige-50 border border-sb-beige-200"
                      >
                        <Icon className="w-4 h-4 text-sb-orange-500 shrink-0" />
                        <span className="text-sm text-stone-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors font-medium"
          >
            Close
          </button>
          {onSelectAccommodation && (
            <button
              onClick={() => {
                onSelectAccommodation(selectedType);
                onClose();
              }}
              className="px-6 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition-colors font-medium"
            >
              Select {selectedAccommodation.name}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

