'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, MessageCircle, Wifi, Thermometer, Shield, Star, Clock, MapPin, Globe, ChevronDown } from 'lucide-react';
import { TRIP_TEMPLATES, TripTemplate } from '@/lib/tripTemplates';
import { CITY_PRESETS, CityPreset, RegionKey } from '@/lib/cityPresets';

// ─── Flag emoji → CDN image ───────────────────────────────────────────────────
function flagUrl(emoji: string): string {
  try {
    const code = [...emoji]
      .map(c => (c.codePointAt(0)! - 0x1F1E6 + 65))
      .map(n => String.fromCharCode(n))
      .join('')
      .toLowerCase();
    return `https://flagcdn.com/w80/${code}.png`;
  } catch {
    return '';
  }
}

// ─── Currency helpers ─────────────────────────────────────────────────────────
const USD_TO_ZAR = 18.5;
const SB_FEE = 1.15; // 15% service fee baked into package cost

function usdToZar(usdStr: string): string {
  if (!usdStr || usdStr === '—') return usdStr;
  // Only use the first (lower) value and prefix with "from"
  const match = usdStr.match(/\$[\d,]+/);
  if (!match) return usdStr;
  const num = parseInt(match[0].replace(/[$,]/g, ''), 10);
  const zar = Math.round((num * USD_TO_ZAR) / 500) * 500;
  return `from R${zar.toLocaleString()}`;
}

// Parse lower and upper bounds out of a "$x - $y" string
function parseBounds(str: string): [number, number] {
  const nums = [...str.matchAll(/\$[\d,]+/g)].map(m => parseInt(m[0].replace(/[$,]/g, ''), 10));
  if (!nums.length) return [0, 0];
  return [nums[0], nums[nums.length - 1]];
}

// SB Package = (accommodation + coworking) × 1.15, in ZAR — lower bound only
function sbPackageZar(accommodation: string, coworking: string): string {
  const [aL] = parseBounds(accommodation);
  const [cL] = parseBounds(coworking);
  const low = Math.round(((aL + cL) * SB_FEE * USD_TO_ZAR) / 500) * 500;
  return `from R${low.toLocaleString()}`;
}

// Total monthly = SB Package + lifestyle — lower bound only
function totalMonthlyZar(accommodation: string, coworking: string, meals: string): string {
  const [aL] = parseBounds(accommodation);
  const [cL] = parseBounds(coworking);
  const [mL] = parseBounds(meals);
  const low = Math.round(((aL + cL) * SB_FEE + mL) * USD_TO_ZAR / 500) * 500;
  return `from R${low.toLocaleString()}`;
}

// ─── Lifestyle price hints by city (fallback to region) ──────────────────────
type LifestyleHint = { emoji: string; label: string; price: string };

const CITY_LIFESTYLE_HINTS: Record<string, LifestyleHint[]> = {
  // ── Southeast Asia ──────────────────────────────────────────────────────────
  // Bali (Canggu): tourist-heavy, pricier than rest of Bali. Bintang ~R35-40 at warung, R45-55 at bar
  'Bali (Canggu)': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R45' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R45' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R1,200' },
    { emoji: '🏄', label: 'Activities & nights out', price: 'from R2,000/mo' },
  ],
  // Ubud: slightly cheaper, more local feel
  'Ubud': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R35' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R35' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R40' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R1,100' },
    { emoji: '🧘', label: 'Activities & nights out', price: 'from R1,800/mo' },
  ],
  // Chiang Mai: very affordable. Pad thai ~50-80 THB = R30-45. Chang beer ~60-80 THB = R35-45
  'Chiang Mai': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R35' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R28' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R35' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R650' },
    { emoji: '🏯', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  // Bangkok: slightly pricier than CM. Street food R35-45, Chang at bar R45-60
  'Bangkok': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R40' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R45' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R1,000' },
    { emoji: '🌃', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  // Thai islands: scooter-dependent, slightly more than mainland
  'Koh Lanta': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R50' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R50' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R950' },
    { emoji: '🤿', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  'Koh Samui': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R55' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R45' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R55' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R1,000' },
    { emoji: '🏖️', label: 'Activities & nights out', price: 'from R2,000/mo' },
  ],
  'Phuket': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R50' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R50' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R1,000' },
    { emoji: '🥊', label: 'Activities & nights out', price: 'from R1,800/mo' },
  ],
  // Vietnam: very cheap. Pho/banh mi R22-35. Bia Hoi R15-22. Vietnamese drip coffee R12-18
  'Da Nang': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R25' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R15' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R22' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R600' },
    { emoji: '🏖️', label: 'Activities & nights out', price: 'from R1,000/mo' },
  ],
  'Ho Chi Minh City': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R30' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R18' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R25' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R650' },
    { emoji: '🌆', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  'Hanoi': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R25' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R18' },
    { emoji: '🍺', label: 'Bia Hoi (street beer)',  price: 'from R15' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R600' },
    { emoji: '🏮', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  // Cambodia: USD economy, cheap
  'Phnom Penh': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R28' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R22' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R25' },
    { emoji: '🛺', label: 'Monthly transport',       price: 'from R600' },
    { emoji: '🌅', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  // KL: hawker food cheap. Alcohol heavily taxed in Malaysia — beer R70+ is accurate
  'Kuala Lumpur': [
    { emoji: '🍜', label: 'Meal at a hawker centre', price: 'from R30' },
    { emoji: '☕', label: 'Coffee (kopi)',            price: 'from R22' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R70' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R700' },
    { emoji: '🛍️', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  // Singapore: hawker meal $3-5 = R55-90. Beer at bar $8-12 = R150-220
  'Singapore': [
    { emoji: '🍜', label: 'Meal at a hawker centre', price: 'from R55' },
    { emoji: '☕', label: 'Coffee (kopi)',            price: 'from R22' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R150' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R1,500' },
    { emoji: '🌃', label: 'Activities & nights out', price: 'from R3,000/mo' },
  ],
  // ── Latin America ───────────────────────────────────────────────────────────
  // Mexico City: tacos R25-40, café coffee R40-55, beer at cantina R35-50, metro cheap
  'Mexico City': [
    { emoji: '🌮', label: 'Tacos / local meal',     price: 'from R45' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R45' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R40' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R400' },
    { emoji: '🎨', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  // Playa: tourist prices, higher than CDMX
  'Playa del Carmen': [
    { emoji: '🌮', label: 'Meal at a local spot',   price: 'from R55' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R45' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R45' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R600' },
    { emoji: '🤿', label: 'Activities & nights out', price: 'from R1,800/mo' },
  ],
  // Oaxaca: cheaper than CDMX
  'Oaxaca': [
    { emoji: '🌮', label: 'Meal at a local spot',   price: 'from R40' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R35' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R30' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R450' },
    { emoji: '🏺', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  // Colombia: tinto (black coffee) is R8-15 at street stalls, R25-40 at cafés
  'Medellín': [
    { emoji: '🍱', label: 'Meal (almuerzo)',         price: 'from R45' },
    { emoji: '☕', label: 'Coffee (tinto)',           price: 'from R20' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R35' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R500' },
    { emoji: '💃', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  'Bogotá': [
    { emoji: '🍱', label: 'Meal (almuerzo)',         price: 'from R45' },
    { emoji: '☕', label: 'Coffee (tinto)',           price: 'from R18' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R35' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R450' },
    { emoji: '🏔️', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  // Cartagena: tourist prices, higher
  'Cartagena': [
    { emoji: '🌮', label: 'Meal at a local spot',   price: 'from R60' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R40' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R500' },
    { emoji: '🏝️', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  // Brazil: boteco beer R35-50, café coffee R28-40
  'Rio': [
    { emoji: '🥗', label: 'Meal at a local spot',   price: 'from R65' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R30' },
    { emoji: '🍺', label: 'Beer (boteco)',           price: 'from R40' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R700' },
    { emoji: '🎉', label: 'Activities & nights out', price: 'from R1,800/mo' },
  ],
  'São Paulo': [
    { emoji: '🥗', label: 'Meal at a local spot',   price: 'from R65' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R30' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R45' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R750' },
    { emoji: '🌃', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  // Argentina: prices at official USD rate
  'Buenos Aires': [
    { emoji: '🥩', label: 'Meal at a local spot',   price: 'from R55' },
    { emoji: '☕', label: 'Coffee (cortado)',        price: 'from R30' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R40' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R350' },
    { emoji: '💃', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  'Lima': [
    { emoji: '🐟', label: 'Meal (menú del día)',     price: 'from R50' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R30' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R40' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R500' },
    { emoji: '🏄', label: 'Activities & nights out', price: 'from R1,200/mo' },
  ],
  'Santiago': [
    { emoji: '🥗', label: 'Meal at a local spot',   price: 'from R70' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R55' },
    { emoji: '🚇', label: 'Monthly transport',       price: 'from R700' },
    { emoji: '⛷️', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  'Montevideo': [
    { emoji: '🥗', label: 'Meal at a local spot',   price: 'from R80' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R55' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R700' },
    { emoji: '🏖️', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  // ── Europe ──────────────────────────────────────────────────────────────────
  // Portugal: bica/espresso €0.80-1.20 = R16-24. Beer €1.50-2.50 = R30-50. Monthly pass ~€40 = R800
  'Lisbon': [
    { emoji: '🐟', label: 'Meal at a restaurant',   price: 'from R130' },
    { emoji: '☕', label: 'Coffee (bica)',           price: 'from R20' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R35' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R900' },
    { emoji: '🎭', label: 'Activities & nights out', price: 'from R2,500/mo' },
  ],
  'Porto': [
    { emoji: '🐟', label: 'Meal at a restaurant',   price: 'from R110' },
    { emoji: '☕', label: 'Coffee (bica)',           price: 'from R18' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R30' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R800' },
    { emoji: '🍷', label: 'Activities & nights out', price: 'from R2,000/mo' },
  ],
  // Spain: café con leche €1.50-2. Caña €2-3. Monthly metro pass varies
  'Barcelona': [
    { emoji: '🥘', label: 'Menú del día (lunch)',   price: 'from R200' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R35' },
    { emoji: '🍺', label: 'Beer (caña) at a bar',   price: 'from R45' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R900' },
    { emoji: '🎨', label: 'Activities & nights out', price: 'from R3,000/mo' },
  ],
  'Valencia': [
    { emoji: '🥘', label: 'Menú del día (lunch)',   price: 'from R160' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R28' },
    { emoji: '🍺', label: 'Beer (caña) at a bar',   price: 'from R35' },
    { emoji: '🚌', label: 'Monthly transport pass',  price: 'from R500' },
    { emoji: '🚴', label: 'Activities & nights out', price: 'from R2,500/mo' },
  ],
  'Seville': [
    { emoji: '🥘', label: 'Meal (tapas)',            price: 'from R140' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R25' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R35' },
    { emoji: '🚌', label: 'Monthly transport pass',  price: 'from R700' },
    { emoji: '💃', label: 'Activities & nights out', price: 'from R2,200/mo' },
  ],
  // Croatia: beer €2.50-4 = R50-80. No monthly pass, mostly local buses
  'Split': [
    { emoji: '🐟', label: 'Meal at a restaurant',   price: 'from R150' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R35' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R50' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R600' },
    { emoji: '⛵', label: 'Activities & nights out', price: 'from R2,000/mo' },
  ],
  'Dubrovnik': [
    { emoji: '🐟', label: 'Meal at a restaurant',   price: 'from R180' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R65' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R600' },
    { emoji: '🏰', label: 'Activities & nights out', price: 'from R2,500/mo' },
  ],
  // Greece: souvlaki R55-80. Frappé/freddo €2-3. Monthly pass ~€30 = R600
  'Athens': [
    { emoji: '🥙', label: 'Meal (souvlaki/taverna)', price: 'from R100' },
    { emoji: '☕', label: 'Coffee (frappé)',          price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a bar',            price: 'from R60' },
    { emoji: '🚇', label: 'Monthly transport pass',   price: 'from R600' },
    { emoji: '🏛️', label: 'Activities & nights out',  price: 'from R1,800/mo' },
  ],
  // Hungary: very affordable. Beer at ruin bar R50-80. Monthly BKK pass ~€32 = R640
  'Budapest': [
    { emoji: '🥩', label: 'Meal at a restaurant',   price: 'from R100' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer (ruin bar)',         price: 'from R50' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R650' },
    { emoji: '♨️', label: 'Activities & nights out', price: 'from R2,000/mo' },
  ],
  // Czech Republic: famously cheap beer. €1.50-2.50 = R30-50. Monthly pass ~€24 = R480
  'Prague': [
    { emoji: '🥩', label: 'Meal at a restaurant',   price: 'from R100' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R40' },
    { emoji: '🍺', label: 'Beer at a pub',           price: 'from R35' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R500' },
    { emoji: '🏰', label: 'Activities & nights out', price: 'from R2,000/mo' },
  ],
  // Germany: Deutschlandticket €58 = R1,160. Döner kebab R65-85
  'Berlin': [
    { emoji: '🌭', label: 'Meal (döner/restaurant)', price: 'from R100' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R50' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R60' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R1,100' },
    { emoji: '🎶', label: 'Activities & nights out', price: 'from R3,000/mo' },
  ],
  // Netherlands: expensive. OV-chipkaart ~€100/mo = R2,000
  'Amsterdam': [
    { emoji: '🍟', label: 'Meal at a restaurant',   price: 'from R190' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R60' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R80' },
    { emoji: '🚲', label: 'Monthly transport pass',  price: 'from R2,000' },
    { emoji: '🎨', label: 'Activities & nights out', price: 'from R4,000/mo' },
  ],
  // Italy: espresso at bar €1-1.50 = R20-30. Trattoria meal €10-18
  'Florence': [
    { emoji: '🍝', label: 'Meal at a trattoria',    price: 'from R180' },
    { emoji: '☕', label: 'Espresso at a bar',       price: 'from R22' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R60' },
    { emoji: '🚌', label: 'Monthly transport pass',  price: 'from R700' },
    { emoji: '🖼️', label: 'Activities & nights out', price: 'from R2,800/mo' },
  ],
};

// Region-level fallbacks
const REGION_LIFESTYLE_HINTS: Record<RegionKey, LifestyleHint[]> = {
  'southeast-asia': [
    { emoji: '🍜', label: 'Meal at a local spot',   price: 'from R35' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R28' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R35' },
    { emoji: '🛵', label: 'Monthly transport',       price: 'from R700' },
    { emoji: '🏄', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
  'europe': [
    { emoji: '🍝', label: 'Meal at a restaurant',   price: 'from R130' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R30' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R50' },
    { emoji: '🚇', label: 'Monthly transport pass',  price: 'from R700' },
    { emoji: '🎭', label: 'Activities & nights out', price: 'from R2,500/mo' },
  ],
  'latin-america': [
    { emoji: '🌮', label: 'Meal at a local spot',   price: 'from R50' },
    { emoji: '☕', label: 'Coffee',                  price: 'from R30' },
    { emoji: '🍺', label: 'Beer at a bar',           price: 'from R40' },
    { emoji: '🚌', label: 'Monthly transport',       price: 'from R500' },
    { emoji: '💃', label: 'Activities & nights out', price: 'from R1,500/mo' },
  ],
};

function findCityRegion(cityName: string): RegionKey | null {
  const normalised = cityName.toLowerCase().replace(/[^a-z]/g, '');
  for (const [region, presets] of Object.entries(CITY_PRESETS)) {
    if (presets.some(p => {
      const cn = p.city.toLowerCase().replace(/[^a-z]/g, '');
      return cn === normalised || normalised.includes(cn) || cn.includes(normalised);
    })) return region as RegionKey;
  }
  return null;
}

function getCityLifestyleHints(cityName: string): LifestyleHint[] | null {
  // Exact match first
  if (CITY_LIFESTYLE_HINTS[cityName]) return CITY_LIFESTYLE_HINTS[cityName];
  // Partial match (handles slight name variations)
  const normalised = cityName.toLowerCase().replace(/[^a-z]/g, '');
  for (const [key, hints] of Object.entries(CITY_LIFESTYLE_HINTS)) {
    const kn = key.toLowerCase().replace(/[^a-z]/g, '');
    if (kn === normalised || normalised.includes(kn) || kn.includes(normalised)) return hints;
  }
  return null;
}

// ─── Visa info for SA passport holders ───────────────────────────────────────
const VISA_INFO: Record<string, { days: string; type: string; notes: string }> = {
  Thailand:        { days: '30 days',  type: 'Visa-free',         notes: 'Extendable to 60 days at immigration office. Easy border run for resets.' },
  Indonesia:       { days: '30 days',  type: 'Visa on arrival',   notes: 'Visa on arrival ~$35 USD. Extendable once for another 30 days.' },
  Vietnam:         { days: '45 days',  type: 'Visa-free',         notes: '90-day e-visa available for ~$25 USD. Best option for longer stays.' },
  Malaysia:        { days: '90 days',  type: 'Visa-free',         notes: 'Very generous. Easy to stay for 3 months without any extension.' },
  Singapore:       { days: '30 days',  type: 'Visa-free',         notes: 'Clean, easy entry. Not ideal for long stays due to cost.' },
  Mexico:          { days: '180 days', type: 'Visa-free',         notes: 'Extremely generous. Ask for 180 days at the border.' },
  Colombia:        { days: '90 days',  type: 'Visa-free',         notes: 'Extendable to 180 days total per year.' },
  Argentina:       { days: '90 days',  type: 'Visa-free',         notes: 'Extendable once. Strong expat community.' },
  Brazil:          { days: '90 days',  type: 'Visa-free',         notes: 'Extensions available. Rio and Florianópolis are popular bases.' },
  Peru:            { days: '183 days', type: 'Visa-free',         notes: 'One of the most generous visa-free allowances for SA passport holders.' },
  Chile:           { days: '90 days',  type: 'Visa-free',         notes: 'Reliable, straightforward entry.' },
  Uruguay:         { days: '90 days',  type: 'Visa-free',         notes: 'Low-key entry. Calm lifestyle, strong internet.' },
  Portugal:        { days: '90 days',  type: 'Schengen',          notes: 'Part of the Schengen zone. 90 days in any 180-day period across all Schengen countries.' },
  Spain:           { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone. Plan your 90 days carefully across countries.' },
  Croatia:         { days: '90 days',  type: 'Visa-free',         notes: 'Croatia is EU but not Schengen. Separate 90-day allowance from Schengen.' },
  Greece:          { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone. Combine with other Schengen countries within your 90-day window.' },
  Hungary:         { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Germany:         { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Netherlands:     { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Italy:           { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  'Czech Republic':{ days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Georgia:         { days: '365 days', type: 'Visa-free',         notes: 'A full year visa-free. One of the best in the world for SA passport holders.' },
  Turkey:          { days: '90 days',  type: 'Visa-free',         notes: 'Extendable. Istanbul and Antalya are popular nomad bases.' },
  Cambodia:        { days: '30 days',  type: 'Visa on arrival',   notes: 'E-visa available. Inexpensive and easy to extend.' },
};

// ─── Helper: find city preset by name ────────────────────────────────────────
function findCityPreset(cityName: string): CityPreset | undefined {
  const normalised = cityName.toLowerCase().replace(/[^a-z]/g, '');
  for (const region of Object.values(CITY_PRESETS)) {
    const match = region.find((c) => {
      const cn = c.city.toLowerCase().replace(/[^a-z]/g, '');
      return cn === normalised || normalised.includes(cn) || cn.includes(normalised);
    });
    if (match) return match;
  }
  return undefined;
}

// ─── Helper: find template across all regions ────────────────────────────────
function findTemplate(id: string): (TripTemplate & { regionKey: RegionKey }) | null {
  for (const [regionKey, templates] of Object.entries(TRIP_TEMPLATES)) {
    const t = templates.find((t) => t.id === id);
    if (t) return { ...t, regionKey: regionKey as RegionKey };
  }
  return null;
}

// ─── Region labels ────────────────────────────────────────────────────────────
const REGION_LABELS: Record<RegionKey, string> = {
  'southeast-asia': 'Southeast Asia',
  'latin-america':  'Latin America',
  'europe':         'Europe',
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4 min-w-[120px]">
      <div className="text-sb-orange-500">{icon}</div>
      <div className="text-lg font-black text-sb-navy-800">{value}</div>
      <div className="text-xs text-sb-navy-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ─── City card ────────────────────────────────────────────────────────────────
function CityCard({ city, index, total }: { city: string; index: number; total: number }) {
  const preset = findCityPreset(city);
  const [showLifestyle, setShowLifestyle] = useState(false);
  const region = findCityRegion(city);
  const hints = getCityLifestyleHints(city) ?? (region ? REGION_LIFESTYLE_HINTS[region] : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={preset?.imageUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop`}
          alt={city}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
              <span>{preset?.flag}</span>
              <span>{preset?.country || ''}</span>
            </div>
            <h3 className="text-xl font-black">{city}</h3>
          </div>
          <div className="text-right text-xs font-semibold text-white/80">
            <Clock className="w-3.5 h-3.5 inline-block mr-1" />
            ~30 days
          </div>
        </div>
        {/* Step indicator */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-sb-orange-500 text-white flex items-center justify-center text-sm font-black shadow-lg">
          {index + 1}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {preset ? (
          <>
            {/* Key stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-sb-beige-100 p-2">
                <div className="text-sm font-black text-sb-navy-800">{preset.weather.avgTemp}</div>
                <div className="text-xs text-sb-navy-500">Avg temp</div>
              </div>
              <div className="rounded-xl bg-sb-teal-50 p-2">
                <div className="text-sm font-black text-sb-navy-800">{preset.internetSpeed.replace(' avg', '')}</div>
                <div className="text-xs text-sb-navy-500">Internet</div>
              </div>
              <div className="rounded-xl bg-sb-mint-100 p-2">
                <div className="text-sm font-black text-sb-navy-800">{preset.nomadScore}/10</div>
                <div className="text-xs text-sb-navy-500">Nomad score</div>
              </div>
            </div>

            {/* Neighbourhoods */}
            {preset.highlights.places.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-1.5">Stay in</p>
                <div className="flex flex-wrap gap-1.5">
                  {preset.highlights.places.map((p) => (
                    <span key={p} className="rounded-full bg-sb-beige-100 px-3 py-1 text-xs font-semibold text-sb-navy-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {preset.highlights.activities.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-1.5">Things to do</p>
                <ul className="space-y-1">
                  {preset.highlights.activities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-sb-navy-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sb-orange-400 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Monthly cost — two-part pricing */}
            <div className="rounded-xl bg-gradient-to-r from-sb-navy-700 to-sb-navy-800 text-white p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/60">SB package</span>
                <span className="font-black text-sm">{sbPackageZar(preset.costs.accommodation, preset.costs.coworking)}<span className="text-white/50 font-normal text-xs">/mo</span></span>
              </div>
              <button
                onClick={() => setShowLifestyle(v => !v)}
                className="w-full flex items-center justify-between border-t border-white/10 pt-2 text-left"
              >
                <span className="text-xs text-white/50">+ your lifestyle spend</span>
                <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${showLifestyle ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showLifestyle && hints && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 space-y-1.5 border-t border-white/10">
                      {hints.map(h => (
                        <div key={h.label} className="flex items-center justify-between text-xs">
                          <span className="text-white/50 flex items-center gap-1.5">
                            <span>{h.emoji}</span>
                            {h.label}
                          </span>
                          <span className="text-white/70 font-semibold">{h.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Best months */}
            <p className="text-xs text-sb-navy-500">
              <span className="font-bold text-sb-navy-700">Best months: </span>
              {preset.weather.bestMonths}
            </p>
          </>
        ) : (
          <p className="text-sm text-sb-navy-600">Details coming soon for this destination.</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TemplateDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const template = findTemplate(id);
  const [expandedLifestyle, setExpandedLifestyle] = useState<Set<string>>(new Set());
  const toggleLifestyle = (city: string) =>
    setExpandedLifestyle(prev => {
      const next = new Set(prev);
      next.has(city) ? next.delete(city) : next.add(city);
      return next;
    });

  if (!template) return null;

  // Collect unique countries from city presets
  const countries = Array.from(
    new Set(
      template.presetCities
        .map((c) => findCityPreset(c)?.country)
        .filter(Boolean) as string[]
    )
  );

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in the "${template.name}" route. Can you tell me more?`
  );
  const whatsappUrl = `https://wa.me/27872500972?text=${whatsappMsg}`;

  const duration = `${template.presetCities.length * 30} days · ${template.presetCities.length} cities`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden">
        <Image
          src={template.imageUrl}
          alt={template.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Back button */}
        <div className="absolute top-8 left-6 md:left-10 z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {REGION_LABELS[template.regionKey]}
              </span>
              <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-bold text-white/80">
                {duration}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">{template.icon}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                {template.name}
              </h1>
            </div>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mt-2">
              {template.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTAs ─────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-sb-navy-600 font-medium">
            <span className="font-black text-sb-navy-800">{template.name}</span>
            {template.price && (
              <span className="ml-2 text-sb-orange-500 font-bold">from {template.price}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/templates/${id}/itinerary`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border-2 border-sb-navy-700 px-5 py-2 text-sm font-bold text-sb-navy-700 hover:bg-sb-navy-700 hover:text-white transition"
            >
              <Download className="w-4 h-4" />
              Download Itinerary
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sb-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-sb-orange-600 shadow-md hover:shadow-lg transition hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              I want this trip
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-20">

        {/* ── Route visualization ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-4">Your route</p>
          <div className="rounded-3xl bg-sb-navy-800 p-6 md:p-8 overflow-hidden">
            {/* Scrollable city strip */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-1 min-w-max">

                {/* Origin: South Africa */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl shadow-inner">
                    🇿🇦
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white leading-tight">South Africa</div>
                    <div className="text-xs text-white/40 mt-0.5">Depart</div>
                  </div>
                </div>

                {/* Flight line out */}
                <div className="flex items-center gap-0.5 pb-6 mx-1">
                  <div className="w-4 h-px bg-sb-orange-400/50" />
                  <div className="text-sb-orange-400 text-sm">✈</div>
                  <div className="w-4 h-px bg-sb-orange-400/50" />
                </div>

                {template.presetCities.map((city, idx) => {
                  const preset = findCityPreset(city);
                  return (
                    <React.Fragment key={city}>
                      <div className="flex flex-col items-center gap-2 w-24">
                        {/* Flag circle */}
                        <div className="relative w-20 h-20 rounded-full bg-white/10 border-2 border-sb-orange-400/60 overflow-hidden shadow-lg flex items-center justify-center">
                          {preset?.flag ? (
                            <img
                              src={flagUrl(preset.flag)}
                              alt={preset.country}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🌍</span>
                          )}
                          {/* Step badge */}
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-sb-orange-500 text-white text-xs font-black flex items-center justify-center shadow">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-black text-white leading-tight">{city}</div>
                          <div className="text-xs text-white/50 mt-0.5">{preset?.country}</div>
                          <div className="text-xs text-white/30">~30 days</div>
                        </div>
                      </div>

                      {/* Arrow between cities */}
                      {idx < template.presetCities.length - 1 && (
                        <div className="flex items-center gap-1 pb-8 mx-1">
                          <div className="w-5 h-px bg-white/20" />
                          <div className="text-white/30 text-xs">›</div>
                          <div className="w-5 h-px bg-white/20" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Flight line back */}
                <div className="flex items-center gap-0.5 pb-6 mx-1">
                  <div className="w-4 h-px bg-sb-orange-400/50" />
                  <div className="text-sb-orange-400 text-sm" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✈</div>
                  <div className="w-4 h-px bg-sb-orange-400/50" />
                </div>

                {/* Home */}
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl shadow-inner">
                    🏠
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white leading-tight">Home</div>
                    <div className="text-xs text-white/40 mt-0.5">Return</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Clock className="w-3.5 h-3.5 text-sb-orange-400" />
                <span className="text-white/80 font-semibold">{template.presetCities.length * 30} days</span> total
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <MapPin className="w-3.5 h-3.5 text-sb-orange-400" />
                <span className="text-white/80 font-semibold">{template.presetCities.length} cities</span>
              </div>
              {countries.length > 0 && (
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Globe className="w-3.5 h-3.5 text-sb-orange-400" />
                  <span className="text-white/80 font-semibold">{countries.length} {countries.length === 1 ? 'country' : 'countries'}:</span>
                  <span>{countries.join(', ')}</span>
                </div>
              )}
              {template.price && (
                <div className="ml-auto flex items-center gap-1.5 rounded-full bg-sb-orange-500 px-4 py-1.5">
                  <span className="text-xs font-black text-white">from {template.price}</span>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        {(template.price || template.avgWeather || template.internetSpeed || template.safetyRating || template.bestFor) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {template.price && (
              <StatCard icon={<Star className="w-5 h-5" />} label="From" value={template.price} />
            )}
            {template.avgWeather && (
              <StatCard icon={<Thermometer className="w-5 h-5" />} label="Avg weather" value={template.avgWeather} />
            )}
            {template.internetSpeed && (
              <StatCard icon={<Wifi className="w-5 h-5" />} label="Internet" value={template.internetSpeed} />
            )}
            {template.safetyRating && (
              <StatCard icon={<Shield className="w-5 h-5" />} label="Safety" value={template.safetyRating} />
            )}
            {template.bestFor && (
              <StatCard icon={<MapPin className="w-5 h-5" />} label="Best for" value={template.bestFor} />
            )}
          </motion.section>
        )}

        {/* ── The Journey ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-sb-navy-800 text-white p-10 md:p-14"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-orange-400 mb-4">The Journey</p>
          <p className="text-xl md:text-2xl leading-relaxed text-white/90 font-medium">
            {template.story}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white/80">
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* ── Per-city breakdown ───────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">City by city</p>
            <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-8">
              What each stop looks like
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {template.presetCities.map((city, idx) => (
              <CityCard
                key={city}
                city={city}
                index={idx}
                total={template.presetCities.length}
              />
            ))}
          </div>
        </section>

        {/* ── Visa snapshot ────────────────────────────────────────────── */}
        {countries.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">SA Passport</p>
            <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-6">
              Visa snapshot
            </h2>
            <div className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden">
              <div className="grid grid-cols-3 bg-sb-navy-800 text-white text-xs font-bold uppercase tracking-wider p-4 gap-4">
                <div>Country</div>
                <div>Days allowed</div>
                <div>Notes</div>
              </div>
              {countries.map((country, idx) => {
                const visa = VISA_INFO[country];
                const preset = Object.values(CITY_PRESETS).flat().find(c => c.country === country);
                return (
                  <div
                    key={country}
                    className={`grid grid-cols-3 gap-4 p-4 text-sm items-start ${idx % 2 === 0 ? 'bg-white' : 'bg-sb-beige-50'}`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sb-navy-800">
                      {preset?.flag && <span>{preset.flag}</span>}
                      {country}
                    </div>
                    <div>
                      {visa ? (
                        <>
                          <div className="font-black text-sb-navy-800">{visa.days}</div>
                          <div className="text-xs text-sb-teal-600 font-semibold">{visa.type}</div>
                        </>
                      ) : (
                        <span className="text-sb-navy-500">Check current rules</span>
                      )}
                    </div>
                    <div className="text-sb-navy-600 text-xs leading-relaxed">
                      {visa?.notes || 'Verify on the official South African government travel portal.'}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-sb-navy-400">
              Visa information is a guide only. Always verify entry requirements before travel as rules change frequently.
            </p>
          </motion.section>
        )}

        {/* ── Budget breakdown ─────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">Costs</p>
          <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-6">
            Monthly budget by city
          </h2>
          <div className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-sb-navy-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-4 gap-4">
              <div>City</div>
              <div>
                SB Package
                <div className="text-white/50 font-normal normal-case tracking-normal mt-0.5">apartment + coworking, all fees incl.</div>
              </div>
              <div>
                Your lifestyle budget
                <div className="text-white/50 font-normal normal-case tracking-normal mt-0.5">food, transport, activities</div>
              </div>
            </div>
            {template.presetCities.map((city, idx) => {
              const preset = findCityPreset(city);
              const region = findCityRegion(city);
              const hints = getCityLifestyleHints(city) ?? (region ? REGION_LIFESTYLE_HINTS[region] : null);
              const isOpen = expandedLifestyle.has(city);
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-sb-beige-50';
              return (
                <React.Fragment key={city}>
                  <div className={`grid grid-cols-3 gap-4 px-5 py-4 items-center ${rowBg}`}>
                    <div className="font-semibold text-sb-navy-800 flex items-center gap-2">
                      {preset?.flag && (
                        <img src={flagUrl(preset.flag)} alt={preset.country} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-sm">{city}</div>
                        <div className="text-xs text-sb-navy-400 font-normal">{preset?.country}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-black text-sb-navy-800 text-sm">
                        {preset ? sbPackageZar(preset.costs.accommodation, preset.costs.coworking) : '—'}
                        <span className="text-sb-navy-400 font-normal text-xs">/mo</span>
                      </div>
                      <div className="text-xs text-sb-navy-400 mt-0.5">paid to South Bound</div>
                    </div>
                    {/* Lifestyle — clickable */}
                    <button
                      onClick={() => toggleLifestyle(city)}
                      className="text-left group flex items-center gap-1.5"
                    >
                      <div>
                        <div className="text-xs font-semibold text-sb-navy-600">
                          {isOpen ? 'hide breakdown' : 'see breakdown'}
                        </div>
                        <div className="text-xs text-sb-navy-400 mt-0.5">food, transport, activities</div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-sb-navy-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Expandable lifestyle breakdown */}
                  <AnimatePresence>
                    {isOpen && hints && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-sb-navy-800"
                      >
                        <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-white/10 pt-3">
                          {hints.map(h => (
                            <div key={h.label} className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2">
                              <span className="text-base">{h.emoji}</span>
                              <div>
                                <div className="text-xs font-bold text-white">{h.price}</div>
                                <div className="text-xs text-white/50">{h.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
            {/* Total row */}
            <div className="border-t-2 border-sb-navy-100 px-5 py-4 bg-sb-beige-50 flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm font-bold text-sb-navy-700">Estimated monthly total across all cities</div>
              <div className="text-right">
                <div className="font-black text-sb-navy-800 text-lg">
                  {(() => {
                    const presets = template.presetCities.map(c => findCityPreset(c)).filter(Boolean) as ReturnType<typeof findCityPreset>[];
                    if (!presets.length) return '—';
                    const validPresets = presets.filter(p => p != null) as NonNullable<ReturnType<typeof findCityPreset>>[];
                    const totalLow = validPresets.reduce((sum, p) => {
                      const [aL] = parseBounds(p.costs.accommodation);
                      const [cL] = parseBounds(p.costs.coworking);
                      return sum + (aL + cL) * SB_FEE * USD_TO_ZAR;
                    }, 0);
                    const avgLow = Math.round((totalLow / validPresets.length) / 500) * 500;
                    return `from R${avgLow.toLocaleString()}`;
                  })()}
                </div>
                <div className="text-xs text-sb-navy-400">avg. SB package per month</div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-sb-navy-400">
            SB package covers your apartment, coworking space, and all South Bound fees. Lifestyle budget is your own spend — food, transport, and activities. Estimates in ZAR at ~R18.50/USD.
          </p>
        </motion.section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-sb-orange-500 via-sb-orange-500 to-sb-orange-600 text-white text-center p-12 md:p-20"
        >
          <div className="text-5xl mb-4">{template.icon}</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            This trip is ready. Let&apos;s make it yours.
          </h2>
          <p className="text-white/85 text-lg max-w-xl mx-auto mb-10">
            South Bound handles the research, booking, and logistics. You just show up.
            Message Tyler directly to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-black text-sb-orange-500 shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              <MessageCircle className="w-5 h-5" />
              Message Tyler on WhatsApp
            </a>
            <Link
              href={`/templates/${id}/itinerary`}
              target="_blank"
              className="inline-flex items-center gap-3 rounded-full border-2 border-white px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition"
            >
              <Download className="w-5 h-5" />
              Download itinerary PDF
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-white/25 flex flex-wrap items-center justify-center gap-8 text-sm text-white/75">
            <span>✓ Visa-aware routes</span>
            <span>✓ SA passport friendly</span>
            <span>✓ Work-ready accommodation</span>
            <span>✓ No surprises</span>
          </div>
        </motion.section>

        {/* ── Browse more ──────────────────────────────────────────────── */}
        <div className="text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sb-navy-600 hover:text-sb-orange-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse all routes
          </Link>
        </div>

      </div>
    </div>
  );
}
