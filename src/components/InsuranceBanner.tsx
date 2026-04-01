'use client';

import Link from 'next/link';
import { Shield, Heart, Plane, Phone } from 'lucide-react';

interface InsuranceBannerProps {
  /** 'modal' matches the sb-* colour system used in TripDetailsModal.
   *  'route' matches the stone/white card style used in RouteViewClient. */
  variant?: 'modal' | 'route';
  /** Optional trip duration label e.g. "60 Days" — shown in the subtext */
  duration?: string;
}

const coverPoints = [
  { icon: Heart,  label: 'Emergency medical', detail: 'Up to R120 million' },
  { icon: Plane,  label: 'Trip cancellation',  detail: 'Pre & post departure' },
  { icon: Phone,  label: '24/7 support',        detail: 'WhatsApp & phone' },
];

export default function InsuranceBanner({ variant = 'route', duration }: InsuranceBannerProps) {
  if (variant === 'modal') {
    return (
      <div className="mt-6 rounded-2xl overflow-hidden border border-sb-orange-200 bg-gradient-to-br from-sb-orange-50 to-sb-beige-100">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-sb-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sb-orange-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-sb-navy-700">Santam travel insurance included</p>
              <p className="text-xs text-sb-navy-500">
                {duration ? `Covers your full ${duration} trip` : 'Matched to your full trip duration'}
              </p>
            </div>
          </div>
          <Link
            href="/travel-insurance"
            className="text-xs font-semibold text-sb-orange-600 hover:text-sb-orange-700 transition-colors whitespace-nowrap"
          >
            Full details →
          </Link>
        </div>

        {/* Coverage grid */}
        <div className="grid grid-cols-3 divide-x divide-sb-orange-100 px-0">
          {coverPoints.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="px-4 py-3 text-center">
              <Icon className="w-4 h-4 text-sb-orange-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-sb-navy-700 leading-tight">{label}</p>
              <p className="text-[11px] text-sb-navy-400 mt-0.5">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // route variant
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mt-6">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-[#FDF6EF]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E86B32] flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-900">Santam travel insurance included</p>
            <p className="text-xs text-stone-500">
              {duration ? `Covers your full ${duration} trip` : 'Policy matched to your full route duration'}
            </p>
          </div>
        </div>
        <Link
          href="/travel-insurance"
          className="text-xs font-semibold text-[#E86B32] hover:text-[#d55a24] transition-colors whitespace-nowrap shrink-0"
        >
          Full details →
        </Link>
      </div>

      {/* Coverage grid */}
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        {coverPoints.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="px-4 py-3 text-center">
            <Icon className="w-4 h-4 text-[#E86B32] mx-auto mb-1" />
            <p className="text-xs font-semibold text-stone-800 leading-tight">{label}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
