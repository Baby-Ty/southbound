'use client';

import React, { useState } from 'react';
import { Activity, activities } from '@/lib/activitiesData';
import Image from 'next/image';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const gridSizeClasses = {
    small: 'col-span-1 row-span-1 h-64',
    medium: 'col-span-1 row-span-1 h-80',
    large: 'col-span-2 row-span-2 h-96 md:h-[500px]',
    wide: 'col-span-2 row-span-1 h-64',
    tall: 'col-span-1 row-span-2 h-96',
  };

  return (
    <div
      className={`${gridSizeClasses[activity.gridSize]} relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-900">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${activity.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
      </div>

      {/* Animation Overlays */}
      {isHovered && (
        <>
          {/* Ripple Effect (Water/Surfing/Beach) */}
          {activity.animationType === 'ripple' && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="ripple-animation"></div>
              <div className="ripple-animation animation-delay-1"></div>
              <div className="ripple-animation animation-delay-2"></div>
            </div>
          )}

          {/* Shimmer Effect (Temples) */}
          {activity.animationType === 'shimmer' && (
            <div className="absolute inset-0">
              <div className="shimmer-animation"></div>
            </div>
          )}

          {/* Float Effect (Markets/Lanterns) */}
          {activity.animationType === 'float' && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="floating-element"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  🏮
                </div>
              ))}
            </div>
          )}

          {/* Nature Effect (Amazon/Jungle) */}
          {activity.animationType === 'nature' && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="nature-element"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  🍃
                </div>
              ))}
            </div>
          )}

          {/* Glow Effect (Food/Coffee) */}
          {activity.animationType === 'glow' && (
            <div className="absolute inset-0">
              <div className="glow-pulse"></div>
            </div>
          )}

          {/* Parallax Effect (Mountains/Hiking) */}
          {activity.animationType === 'parallax' && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="cloud cloud-1">☁️</div>
              <div className="cloud cloud-2">☁️</div>
              <div className="cloud cloud-3">☁️</div>
            </div>
          )}

          {/* Pulse Effect (Wildlife) */}
          {activity.animationType === 'pulse' && (
            <div className="absolute inset-0">
              <div className="pulse-ring"></div>
            </div>
          )}
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        {/* Emoji Badge */}
        <div className="mb-3 transform transition-transform duration-300 group-hover:scale-125 w-fit">
          <div className="text-4xl md:text-5xl filter drop-shadow-lg">
            {activity.emoji}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-2xl md:text-3xl mb-2 drop-shadow-lg transform transition-all duration-300 group-hover:translate-y-[-4px]">
          {activity.title}
        </h3>

        {/* Description */}
        <p className="text-white/90 text-sm md:text-base drop-shadow-md mb-3 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          {activity.description}
        </p>

        {/* CTA Arrow */}
        <div className="flex items-center text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
          <span className="mr-2">Explore</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-500"></div>
    </div>
  );
};

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 md:h-80 bg-gray-900">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 896px"
            unoptimized
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${activity.gradient} opacity-60`}></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="text-6xl mb-3">{activity.emoji}</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {activity.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Description */}
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            {activity.longDescription}
          </p>

          {/* Vibe Meters */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">The Vibe</h3>
            <div className="space-y-3">
              <VibeMeter label="Adventure" value={activity.vibe.adventure} color="bg-sb-orange-500" />
              <VibeMeter label="Relaxation" value={activity.vibe.relaxation} color="bg-sb-teal-500" />
              <VibeMeter label="Cultural" value={activity.vibe.cultural} color="bg-rose-500" />
            </div>
          </div>

          {/* Details Grid */}
          {(activity.difficulty || activity.bestTime) && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {activity.difficulty && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Difficulty</div>
                  <div className="font-semibold text-gray-900">{activity.difficulty}</div>
                </div>
              )}
              {activity.bestTime && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Best Time</div>
                  <div className="font-semibold text-gray-900">{activity.bestTime}</div>
                </div>
              )}
            </div>
          )}

          {/* Destinations */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Where You Can Do This</h3>
            <div className="flex flex-wrap gap-3">
              {activity.destinations.map((destination) => (
                <div
                  key={destination}
                  className="bg-gradient-to-r from-sb-orange-50 to-sb-teal-50 border border-sb-orange-200 rounded-full px-4 py-2 text-sm font-medium text-gray-800"
                >
                  📍 {destination}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VibeMeter: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-semibold">{value}/5</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const ActivitiesBentoGrid: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-sb-beige-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 mb-4 bg-gradient-to-r from-orange-50 to-teal-50 px-4 py-2 rounded-full border border-orange-100">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-medium text-gray-700">Your Adventure Awaits</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            What You&apos;ll <span className="text-sb-orange-500">Experience</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Remote work meets adventure. Click any activity to discover where and how you can make it happen.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => setSelectedActivity(activity)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-gray-600 mb-6">
            Ready to start planning your adventure?
          </p>
          <a
            href="/route-builder"
            className="inline-flex items-center px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105"
          >
            <span>🗺️</span>
            <span className="ml-2">Start your journey</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Modal */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}

      <style jsx>{`
        /* Ripple Animation */
        .ripple-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 3s ease-out infinite;
        }
        
        .animation-delay-1 {
          animation-delay: 1s;
        }
        
        .animation-delay-2 {
          animation-delay: 2s;
        }
        
        @keyframes ripple {
          0% {
            width: 100px;
            height: 100px;
            opacity: 1;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }

        /* Shimmer Animation */
        .shimmer-animation {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 215, 0, 0.4) 50%,
            transparent 70%
          );
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          top: 100%;
          font-size: 1.5rem;
          animation: float-up 8s linear infinite;
          opacity: 0.8;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-500px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Nature Elements */
        .nature-element {
          position: absolute;
          top: -20px;
          font-size: 1.2rem;
          animation: nature-fall 6s ease-in infinite;
          opacity: 0.7;
        }
        
        @keyframes nature-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(500px) rotate(180deg);
            opacity: 0;
          }
        }

        /* Glow Pulse */
        .glow-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        /* Cloud Parallax */
        .cloud {
          position: absolute;
          font-size: 2rem;
          opacity: 0.7;
          animation: cloud-move 20s linear infinite;
        }
        
        .cloud-1 {
          top: 20%;
          left: -10%;
        }
        
        .cloud-2 {
          top: 50%;
          left: -15%;
          animation-delay: 7s;
        }
        
        .cloud-3 {
          top: 70%;
          left: -20%;
          animation-delay: 14s;
        }
        
        @keyframes cloud-move {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(120vw);
          }
        }

        /* Pulse Ring */
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          border: 3px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s ease-out infinite;
        }
        
        @keyframes pulse {
          0% {
            width: 200px;
            height: 200px;
            opacity: 1;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }

        /* Modal Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ActivitiesBentoGrid;

