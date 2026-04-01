'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, MessageCircle, Wifi, Thermometer, Shield, Star, Clock, MapPin, Globe, ChevronDown, Bookmark, Check, Copy, X, Loader2, Phone, Mail, User } from 'lucide-react';
import { TRIP_TEMPLATES, TripTemplate } from '@/lib/tripTemplates';
import { CITY_PRESETS, CityPreset, RegionKey } from '@/lib/cityPresets';
import { CITY_ACTIVITIES, ThingToDo } from '@/lib/cityActivities';
import { CITY_DAILY_LIFE, DailyLifeItem, DailyLifeCategory, DAILY_LIFE_GRADIENT, DAILY_LIFE_EMOJI } from '@/lib/cityDailyLife';
import { CITY_FOOD, FoodItem, FoodType, FOOD_TYPE_EMOJI } from '@/lib/cityFood';

// ─── Types ────────────────────────────────────────────────────────────────────
type Stop = { city: string; duration: number };

// ─── Duration options for the panel ──────────────────────────────────────────
const DURATION_OPTIONS = [14, 21, 30, 45, 60];

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

// ─── Category colour map ───────────────────────────────────────────────────────
const CATEGORY_GRADIENT: Record<string, string> = {
  'Culture':     'from-amber-500 to-orange-600',
  'Adventure':   'from-sky-500 to-blue-600',
  'Food & Drink':'from-orange-400 to-red-500',
  'Nightlife':   'from-violet-600 to-purple-700',
  'Nature':      'from-teal-500 to-emerald-600',
  'Wellness':    'from-rose-400 to-pink-500',
  'Day Trip':    'from-sb-navy-600 to-sb-navy-800',
  'Beach':       'from-sky-400 to-cyan-500',
  'Shopping':    'from-fuchsia-500 to-pink-600',
};
const CATEGORY_EMOJI: Record<string, string> = {
  'Culture':     '🏛️',
  'Adventure':   '🏃',
  'Food & Drink':'🍜',
  'Nightlife':   '🍸',
  'Nature':      '🌿',
  'Wellness':    '🧘',
  'Day Trip':    '🗺️',
  'Beach':       '🏖️',
  'Shopping':    '🛍️',
};

// ─── Activity card (grid-ready, category accent) ──────────────────────────────
function ActivityCard({ item, cityLabel, cityFlag }: {
  item: ThingToDo;
  cityLabel?: string;
  cityFlag?: string;
}) {
  const gradient = CATEGORY_GRADIENT[item.category] ?? 'from-sb-navy-700 to-sb-navy-800';
  const emoji    = CATEGORY_EMOJI[item.category]    ?? '🌍';

  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col h-full">
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            target.parentElement!.classList.add('bg-gradient-to-br', ...gradient.split(' '));
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {cityLabel && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1">
            {cityFlag && <span>{cityFlag}</span>}
            {cityLabel}
          </span>
        )}
        <span className={`absolute bottom-2.5 right-2.5 rounded-full bg-gradient-to-r ${gradient} px-2.5 py-1 text-[10px] font-bold text-white shadow`}>
          {emoji} {item.category}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-sm font-black text-sb-navy-800 leading-snug line-clamp-2 group-hover:text-sb-orange-600 transition-colors">
          {item.name}
        </p>
        {item.description && (
          <p className="text-xs text-sb-navy-400 leading-relaxed line-clamp-2 flex-1">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Daily life card (full-width, no fixed width) ────────────────────────────
function DailyLifeCard({ item }: { item: DailyLifeItem }) {
  const gradient = DAILY_LIFE_GRADIENT[item.category] ?? 'from-slate-500 to-slate-700';

  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            target.parentElement!.classList.add('bg-gradient-to-br', ...gradient.split(' '));
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-black text-base leading-snug">{item.name}</p>
        </div>
      </div>
      {item.description && (
        <div className="px-4 py-3.5">
          <p className="text-xs text-sb-navy-500 leading-relaxed">{item.description}</p>
        </div>
      )}
    </div>
  );
}

// ─── Food card (grid-ready, price is hero) ────────────────────────────────────
function foodPriceInZar(usdPrice: string): string | null {
  const match = usdPrice.match(/\$([\d.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  return `~R${Math.round(num * 18.5)}`;
}

function FoodCard({ item }: { item: FoodItem }) {
  const emoji = FOOD_TYPE_EMOJI[item.type] ?? '🍽️';
  const zarPrice = foodPriceInZar(item.price);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col h-full">
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            target.parentElement!.classList.add('bg-gradient-to-br', 'from-orange-400', 'to-red-500');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-2 left-2 rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
          {emoji} {item.type}
        </span>
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
          <span className="rounded-full bg-sb-orange-500 px-2.5 py-0.5 text-xs font-black text-white shadow-lg">
            {item.price}
          </span>
          {zarPrice && (
            <span className="rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
              {zarPrice}
            </span>
          )}
        </div>
      </div>
      <div className="p-3.5 flex flex-col gap-1 flex-1">
        <p className="text-sm font-black text-sb-navy-800 leading-snug line-clamp-1 group-hover:text-sb-orange-600 transition-colors">
          {item.name}
        </p>
        <p className="text-xs text-sb-navy-400 leading-relaxed line-clamp-2 flex-1">
          {item.description}
        </p>
      </div>
    </div>
  );
}

// ─── Day-of-week timeline config ─────────────────────────────────────────────
const DAY_TIMELINE: Array<{ label: string; emoji: string; categories: DailyLifeCategory[] }> = [
  { label: 'Your morning',   emoji: '☕', categories: ['Cafe'] },
  { label: 'Where you work', emoji: '💻', categories: ['Workspace', 'Coworking'] },
  { label: 'After work',     emoji: '💪', categories: ['Gym'] },
  { label: 'Where you live', emoji: '🏠', categories: ['Apartment'] },
];

// ─── Day to Day + Food Section ────────────────────────────────────────────────
function DayToDaySection({ stops }: { stops: { city: string; duration: number }[] }) {
  const [activeCity, setActiveCity] = React.useState(stops[0]?.city ?? '');
  const [activeFoodType, setActiveFoodType] = React.useState<string>('All');

  const lifeItems = CITY_DAILY_LIFE[activeCity] ?? [];
  const foodItems = CITY_FOOD[activeCity] ?? [];
  const foodTypes = ['All', ...Array.from(new Set(foodItems.map((i) => i.type)))] as string[];
  const filteredFood = activeFoodType === 'All' ? foodItems : foodItems.filter((i) => i.type === activeFoodType);

  if (!lifeItems.length && !foodItems.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">Life on the ground</p>
        <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800">Day to day</h2>
      </div>

      {/* City tabs */}
      {stops.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {stops.map((s) => {
            const preset = findCityPreset(s.city);
            const active = activeCity === s.city;
            return (
              <button
                key={s.city}
                onClick={() => { setActiveCity(s.city); setActiveFoodType('All'); }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  active
                    ? 'bg-sb-navy-800 text-white border-sb-navy-800 shadow-md'
                    : 'bg-white text-sb-navy-600 border-gray-200 hover:border-gray-300 hover:bg-sb-beige-50'
                }`}
              >
                {preset?.flag} {s.city}
              </button>
            );
          })}
        </div>
      )}

      {/* Timeline layout */}
      {lifeItems.length > 0 && (
        <div className="space-y-8">
          {DAY_TIMELINE.map(({ label, emoji, categories }) => {
            const sectionItems = lifeItems.filter((i) => categories.includes(i.category));
            if (!sectionItems.length) return null;
            return (
              <div key={label}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{emoji}</span>
                  <p className="font-bold text-sb-navy-700 text-sm">{label}</p>
                  <div className="flex-1 h-px bg-sb-beige-300" />
                </div>
                <div className={`grid gap-4 ${sectionItems.length === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {sectionItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                    >
                      <DailyLifeCard item={item} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Food & drink subsection */}
      {foodItems.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 flex items-center gap-2">
              <span>🍽️</span> Food &amp; drink
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {foodTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFoodType(type)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeFoodType === type
                      ? 'bg-sb-orange-500 text-white shadow'
                      : 'bg-white text-sb-navy-500 ring-1 ring-gray-200 hover:ring-gray-300'
                  }`}
                >
                  {type !== 'All' && FOOD_TYPE_EMOJI[type as FoodType]} {type}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredFood.map((item, i) => (
                <motion.div
                  key={`${item.name}-${item.type}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <FoodCard item={item} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}

// ─── Activities Section with category filter ──────────────────────────────────
const ACTIVITIES_PER_PAGE = 8; // 2 rows × 4 cols (lg breakpoint)

function ActivitiesSection({ stops }: { stops: { city: string; duration: number }[] }) {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [page, setPage] = React.useState(0);

  const allItems: Array<{ item: ThingToDo; city: string; flag?: string }> = [];
  const cityLists = stops.map((s) => ({
    city: s.city,
    flag: findCityPreset(s.city)?.flag,
    items: CITY_ACTIVITIES[s.city] ?? [],
  }));
  const max = Math.max(...cityLists.map((c) => c.items.length), 0);
  for (let i = 0; i < max; i++) {
    for (const cl of cityLists) {
      if (cl.items[i]) allItems.push({ item: cl.items[i], city: cl.city, flag: cl.flag });
    }
  }
  if (!allItems.length) return null;

  const categories = ['All', ...Array.from(new Set(allItems.map((a) => a.item.category)))];
  const filtered = activeFilter === 'All' ? allItems : allItems.filter((a) => a.item.category === activeFilter);

  const totalPages = Math.ceil(filtered.length / ACTIVITIES_PER_PAGE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const paginated = filtered.slice(safePage * ACTIVITIES_PER_PAGE, (safePage + 1) * ACTIVITIES_PER_PAGE);

  const handleFilterChange = (cat: string) => {
    setActiveFilter(cat);
    setPage(0);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">Experiences</p>
          <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800">Things to do</h2>
        </div>
        <span className="text-sm text-sb-navy-500 bg-white ring-1 ring-gray-200 px-3 py-1.5 rounded-full flex-shrink-0">
          {filtered.length} {filtered.length === 1 ? 'activity' : 'activities'}
        </span>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeFilter === cat
                ? 'bg-sb-navy-800 text-white shadow-md'
                : 'bg-white text-sb-navy-600 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-sb-beige-50'
            }`}
          >
            {cat !== 'All' && <span>{CATEGORY_EMOJI[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Activity grid — 2 rows */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map(({ item, city, flag }) => (
            <motion.div
              key={`${city}-${item.name}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ActivityCard item={item} cityLabel={city} cityFlag={flag} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="w-9 h-9 flex items-center justify-center rounded-full ring-1 ring-gray-200 bg-white text-sb-navy-700 hover:bg-sb-beige-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                i === safePage
                  ? 'bg-sb-navy-800 text-white shadow-md'
                  : 'ring-1 ring-gray-200 bg-white text-sb-navy-600 hover:bg-sb-beige-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage === totalPages - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full ring-1 ring-gray-200 bg-white text-sb-navy-700 hover:bg-sb-beige-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      )}
    </motion.section>
  );
}

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

// ─── Destination panel ────────────────────────────────────────────────────────
interface DestinationPanelProps {
  open: boolean;
  isEditing: boolean;
  regionKey: RegionKey;
  pendingCity: string;
  pendingDuration: number;
  onSelectCity: (city: string) => void;
  onChangeDuration: (d: number) => void;
  onRemove: () => void;
  onClose: () => void;
}

function DestinationPanel({
  open, isEditing, regionKey, pendingCity, pendingDuration,
  onSelectCity, onChangeDuration, onRemove, onClose,
}: DestinationPanelProps) {
  const cities = CITY_PRESETS[regionKey] ?? [];
  const regionLabel = { 'southeast-asia': 'Southeast Asia', 'latin-america': 'Latin America', 'europe': 'Europe' }[regionKey];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-base font-black text-sb-navy-800">{isEditing ? 'Edit stop' : 'Add stop'}</h2>
            <p className="text-xs text-sb-navy-400 mt-0.5">Pick a destination from {regionLabel}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Duration picker */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-400 mb-3">Duration</p>
          <div className="flex gap-2 flex-wrap">
            {DURATION_OPTIONS.map(d => (
              <button key={d} onClick={() => onChangeDuration(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${pendingDuration === d ? 'bg-sb-navy-800 text-white border-sb-navy-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {/* City grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-400 mb-3">Choose destination</p>
          <div className="grid grid-cols-2 gap-3">
            {cities.map(city => {
              const isSelected = city.city === pendingCity;
              return (
                <button key={city.city} onClick={() => onSelectCity(city.city)}
                  className={`relative rounded-xl overflow-hidden text-left transition border-2 ${isSelected ? 'border-sb-orange-500 ring-2 ring-sb-orange-400/40' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div className="relative h-24 w-full bg-gray-200">
                    <img src={city.imageUrl} alt={city.city} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sb-orange-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <div className="text-white font-bold text-xs leading-tight drop-shadow">{city.city}</div>
                      <div className="text-white/70 text-xs">{city.country}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Remove button (edit mode only) */}
        {isEditing && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={onRemove}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 py-2.5 text-sm font-semibold transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove this stop
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── City card ────────────────────────────────────────────────────────────────
function CityCard({ city, index, total, onEdit }: { city: string; index: number; total: number; onEdit?: () => void }) {
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
      className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden group h-full"
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
        {/* Edit button */}
        {onEdit && (
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-sb-navy-700 hover:text-sb-navy-900 transition opacity-0 group-hover:opacity-100"
            title="Edit stop"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
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
  const searchParams = useSearchParams();
  const savedId = searchParams?.get('saved') ?? null;
  const template = findTemplate(id);
  const [expandedLifestyle, setExpandedLifestyle] = useState<Set<string>>(new Set());
  const [savedOwnerName, setSavedOwnerName] = useState<string | null>(null);
  const toggleLifestyle = (city: string) =>
    setExpandedLifestyle(prev => {
      const next = new Set(prev);
      next.has(city) ? next.delete(city) : next.add(city);
      return next;
    });

  // ── Editable stops state ─────────────────────────────────────────────────
  const [stops, setStops] = useState<Stop[]>(() =>
    (template?.presetCities ?? []).map(c => ({ city: c, duration: 30 }))
  );

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [pendingCity, setPendingCity] = useState('');
  const [pendingDuration, setPendingDuration] = useState(30);

  // ── AI-generated story state ──────────────────────────────────────────────
  const [story, setStory] = useState(template?.story ?? '');
  const [storyLoading, setStoryLoading] = useState(false);
  const storyDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial render — keep the original static story
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (storyDebounce.current) clearTimeout(storyDebounce.current);

    storyDebounce.current = setTimeout(async () => {
      if (stops.length === 0) return;
      setStoryLoading(true);
      try {
        const res = await fetch('/api/generate-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stops, templateName: template?.name }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.story) setStory(data.story);
        }
      } catch (err) {
        console.error('Story generation failed:', err);
      } finally {
        setStoryLoading(false);
      }
    }, 800);

    return () => {
      if (storyDebounce.current) clearTimeout(storyDebounce.current);
    };
  }, [stops]);


  const openEdit = (idx: number) => {
    setEditingIndex(idx);
    setPendingCity(stops[idx].city);
    setPendingDuration(stops[idx].duration);
    setPanelOpen(true);
  };
  const openAdd = () => {
    setEditingIndex(null);
    setPendingCity('');
    setPendingDuration(30);
    setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setEditingIndex(null); };

  const handleSelectCity = (city: string) => {
    if (editingIndex !== null) {
      setStops(prev => prev.map((s, i) => i === editingIndex ? { city, duration: pendingDuration } : s));
    } else {
      setStops(prev => [...prev, { city, duration: pendingDuration }]);
    }
    closePanel();
  };
  const handleChangeDuration = (d: number) => {
    setPendingDuration(d);
    if (editingIndex !== null) {
      setStops(prev => prev.map((s, i) => i === editingIndex ? { ...s, duration: d } : s));
    }
  };
  const removeStop = () => {
    if (editingIndex !== null) setStops(prev => prev.filter((_, i) => i !== editingIndex));
    closePanel();
  };

  // ── Load saved route when ?saved= param is present ───────────────────────
  useEffect(() => {
    if (!savedId) return;
    fetch(`/api/routes/${savedId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.route) return;
        const saved = data.route;
        // Hydrate stops from the saved route
        const loadedStops: Stop[] = saved.stops.map((s: any) => ({
          city: s.city,
          duration: (s.weeks ?? 4) * 7,
        }));
        if (loadedStops.length > 0) setStops(loadedStops);
        if (saved.story) setStory(saved.story);
        if (saved.name) setSavedOwnerName(saved.name);
        // Mark first-render guard as done so future stop changes trigger AI
        isFirstRender.current = false;
      })
      .catch(() => {/* silently ignore — just show default template */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedId]);

  // ── Save-trip modal state ─────────────────────────────────────────────────
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveEmail, setSaveEmail] = useState('');
  const [savePhone, setSavePhone] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedRouteId, setSavedRouteId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleSaveTrip = async () => {
    setSaveError('');
    if (!saveName.trim()) { setSaveError('Name is required'); return; }
    if (!saveEmail.trim()) { setSaveError('Email is required'); return; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(saveEmail.trim());
    if (!emailOk) { setSaveError('Enter a valid email'); return; }

    setSaveLoading(true);
    try {
      // Convert template stops → StopPlan format
      const stopPlans = stops.map((s, idx) => {
        const preset = Object.values(CITY_PRESETS).flat().find(p => p.city === s.city);
        return {
          id: `stop-${idx}-${Date.now()}`,
          city: s.city,
          country: preset?.country ?? '',
          weeks: Math.max(1, Math.round(s.duration / 7)),
          budgetCoins: 2 as const,
          tags: [],
          highlights: { places: [], accommodation: '', activities: [], notes: '' },
        };
      });

      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveName.trim(),
          email: saveEmail.trim(),
          phone: savePhone.trim() || undefined,
          region: template!.regionKey,
          stops: stopPlans,
          preferences: { lifestyle: [], workSetup: [], travelStyle: 'slow-travel' },
          source: 'template',
          templateId: template!.id,
          templateName: template!.name,
          story,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save trip');
      }

      const data = await res.json();
      setSavedRouteId(data.route.id);
    } catch (err: any) {
      setSaveError(err.message || 'Something went wrong');
    } finally {
      setSaveLoading(false);
    }
  };

  const savedLink = savedRouteId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/templates/${id}?saved=${savedRouteId}`
    : '';

  const copyLink = () => {
    if (savedLink) {
      navigator.clipboard.writeText(savedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  if (!template) return null;

  // Collect unique countries from current stops (reactive)
  const countries = Array.from(
    new Set(
      stops
        .map((s) => findCityPreset(s.city)?.country)
        .filter(Boolean) as string[]
    )
  );

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in the "${template.name}" route. Can you tell me more?`
  );
  const whatsappUrl = `https://wa.me/27872500972?text=${whatsappMsg}`;

  const totalDays = stops.reduce((sum, s) => sum + s.duration, 0);
  const duration = `${totalDays} days · ${stops.length} ${stops.length === 1 ? 'city' : 'cities'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50">

      {/* ── Saved-trip banner ──────────────────────────────────────────── */}
      {savedId && (
        <div className="bg-sb-navy-800 text-white text-sm px-4 py-2.5 flex items-center justify-center gap-2 text-center">
          <Bookmark className="w-3.5 h-3.5 text-sb-orange-400 flex-shrink-0" />
          <span>
            {savedOwnerName
              ? <><strong>{savedOwnerName}'s</strong> saved trip</>
              : 'Your saved trip'
            }
            {' '}— stops and story are personalised to your itinerary.
          </span>
        </div>
      )}

      {/* ── Destination panel ─────────────────────────────────────────── */}
      <DestinationPanel
        open={panelOpen}
        isEditing={editingIndex !== null}
        regionKey={template.regionKey}
        pendingCity={pendingCity}
        pendingDuration={pendingDuration}
        onSelectCity={handleSelectCity}
        onChangeDuration={handleChangeDuration}
        onRemove={removeStop}
        onClose={closePanel}
      />

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

      {/* ── Sticky nav ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          {/* Left: trip identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-sb-navy-800 font-black text-sm truncate">{template.name}</span>
            {template.price && (
              <span className="hidden sm:inline-flex text-xs font-bold text-sb-orange-600 bg-sb-orange-50 px-2.5 py-0.5 rounded-full flex-shrink-0">
                from {template.price}
              </span>
            )}
          </div>
          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { setSaveModalOpen(true); setSavedRouteId(null); setSaveError(''); }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-sb-navy-600 hover:text-sb-navy-800 hover:bg-gray-100 transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sb-orange-500 hover:bg-sb-orange-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:shadow transition"
            >
              <MessageCircle className="w-4 h-4" />
              I want this trip
            </a>
          </div>
        </div>
      </nav>

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

                {stops.map((stop, idx) => {
                  const preset = findCityPreset(stop.city);
                  return (
                    <React.Fragment key={`${stop.city}-${idx}`}>
                      <div className="flex flex-col items-center gap-2 w-24 group/routenode">
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
                          {/* Edit overlay */}
                          <button
                            onClick={() => openEdit(idx)}
                            className="absolute inset-0 rounded-full bg-black/0 group-hover/routenode:bg-black/40 flex items-center justify-center opacity-0 group-hover/routenode:opacity-100 transition-all"
                            title="Edit stop"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-black text-white leading-tight">{stop.city}</div>
                          <div className="text-xs text-white/50 mt-0.5">{preset?.country}</div>
                          <div className="text-xs text-white/30">{stop.duration} days</div>
                        </div>
                      </div>

                      {/* Arrow between cities */}
                      {idx < stops.length - 1 && (
                        <div className="flex items-center gap-1 pb-8 mx-1">
                          <div className="w-5 h-px bg-white/20" />
                          <div className="text-white/30 text-xs">›</div>
                          <div className="w-5 h-px bg-white/20" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Add stop node */}
                <div className="flex items-center gap-0.5 pb-8 mx-1">
                  <div className="w-3 h-px bg-white/10" />
                </div>
                <button onClick={openAdd} className="flex flex-col items-center gap-2 w-20 group/addnode" title="Add stop">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 group-hover/addnode:border-sb-orange-400/70 flex items-center justify-center text-white/40 group-hover/addnode:text-sb-orange-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-xs text-white/30 group-hover/addnode:text-sb-orange-400/80 font-bold transition-colors">Add stop</div>
                </button>
                <div className="flex items-center gap-0.5 pb-8 mx-1">
                  <div className="w-3 h-px bg-white/10" />
                </div>

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
                <span className="text-white/80 font-semibold">{totalDays} days</span> total
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <MapPin className="w-3.5 h-3.5 text-sb-orange-400" />
                <span className="text-white/80 font-semibold">{stops.length} {stops.length === 1 ? 'city' : 'cities'}</span>
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
          <div className="relative min-h-[4rem]">
            {storyLoading && (
              <div className="absolute inset-0 flex items-start gap-2 text-white/40 text-sm pt-1">
                <svg className="animate-spin w-4 h-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Updating your journey...</span>
              </div>
            )}
            <p className={`text-xl md:text-2xl leading-relaxed text-white/90 font-medium transition-opacity duration-300 ${storyLoading ? 'opacity-30' : 'opacity-100'}`}>
              {story}
            </p>
          </div>
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

          {/* All stops on one row — breaks out of max-w-5xl container */}
          <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
            <div className="flex gap-5 px-8 justify-center flex-wrap">
              <AnimatePresence>
                {stops.map((stop, idx) => (
                  <motion.div
                    key={stop.city + idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: idx * 0.08, ease: 'easeOut' } }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="flex-1 min-w-[280px] max-w-[380px]"
                  >
                    <CityCard city={stop.city} index={idx} total={stops.length} onEdit={() => openEdit(idx)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Add stop button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={openAdd}
              className="flex items-center gap-2.5 rounded-full border-2 border-dashed border-gray-200 hover:border-sb-orange-400/60 hover:bg-sb-orange-50/40 px-6 py-3 text-gray-400 hover:text-sb-orange-500 transition-all group"
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 group-hover:border-sb-orange-400/60 flex items-center justify-center transition-colors flex-shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Add stop</span>
              <span className="text-xs text-gray-400 group-hover:text-sb-orange-400">Another city from {REGION_LABELS[template.regionKey]}</span>
            </button>
          </div>
        </section>

        {/* ── Things to do ─────────────────────────────────────────────── */}
        <ActivitiesSection stops={stops} />

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

        {/* ── Travel insurance ─────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">Peace of mind</p>
          <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-6">
            Travel insurance included
          </h2>
          <div className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#2a1d13] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Shield className="w-4.5 h-4.5 text-[#f5ede4]" />
                </div>
                <div>
                  <p className="text-[#f5ede4] font-bold text-base leading-tight">Santam travel insurance</p>
                  <p className="text-[#a08060] text-xs mt-0.5">Underwritten by Santam Limited · Included in every package</p>
                </div>
              </div>
              <Link
                href="/travel-insurance"
                className="text-xs font-bold text-[#E86B32] hover:text-orange-400 transition-colors whitespace-nowrap"
              >
                Full details →
              </Link>
            </div>

            {/* Coverage rows */}
            {[
              { label: 'Emergency medical',      value: 'Up to R120 million',      sub: 'Direct payment to international providers' },
              { label: 'Trip cancellation',       value: 'Covered',                 sub: 'Pre and post departure' },
              { label: 'Lost or delayed luggage', value: 'Covered',                 sub: 'Bags and valuables' },
              { label: '24/7 emergency support',  value: 'WhatsApp + phone',        sub: 'Multilingual, around the clock' },
              { label: 'Children under 21',       value: 'Free',                    sub: 'No extra cost' },
              { label: 'Trip duration',           value: 'Matched to your route',   sub: 'Not capped at 30 or 60 days' },
            ].map((row, idx) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-6 py-4 text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-sb-beige-50'}`}
              >
                <div>
                  <p className="font-semibold text-sb-navy-800">{row.label}</p>
                  <p className="text-xs text-sb-navy-400 mt-0.5">{row.sub}</p>
                </div>
                <p className="font-black text-sb-navy-800 text-right">{row.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-sb-navy-400">
            Insurance is included in your South Bound package cost and matched to your full trip duration.{' '}
            <Link href="/travel-insurance" className="text-sb-orange-600 hover:underline">
              Learn more about what's covered.
            </Link>
          </p>
        </motion.section>

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
            {stops.map((stop, idx) => {
              const city = stop.city;
              const preset = findCityPreset(city);
              const region = findCityRegion(city);
              const hints = getCityLifestyleHints(city) ?? (region ? REGION_LIFESTYLE_HINTS[region] : null);
              const isOpen = expandedLifestyle.has(city);
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-sb-beige-50';
              return (
                <React.Fragment key={`budget-${city}-${idx}`}>
                  <div className={`grid grid-cols-3 gap-4 px-5 py-4 items-center ${rowBg}`}>
                    <div className="font-semibold text-sb-navy-800 flex items-center gap-2">
                      {preset?.flag && (
                        <img src={flagUrl(preset.flag)} alt={preset.country} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-sm">{city}</div>
                        <div className="text-xs text-sb-navy-400 font-normal">{preset?.country} · {stop.duration} days</div>
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
                    const validStops = stops.map(s => findCityPreset(s.city)).filter(Boolean) as NonNullable<ReturnType<typeof findCityPreset>>[];
                    if (!validStops.length) return '—';
                    const totalLow = validStops.reduce((sum, p) => {
                      const [aL] = parseBounds(p.costs.accommodation);
                      const [cL] = parseBounds(p.costs.coworking);
                      return sum + (aL + cL) * SB_FEE * USD_TO_ZAR;
                    }, 0);
                    const avgLow = Math.round((totalLow / validStops.length) / 500) * 500;
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
            <button
              onClick={() => { setSaveModalOpen(true); setSavedRouteId(null); setSaveError(''); }}
              className="inline-flex items-center gap-3 rounded-full border-2 border-white px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition"
            >
              <Bookmark className="w-5 h-5" />
              Save my trip
            </button>
            <Link
              href={`/templates/${id}/itinerary`}
              target="_blank"
              className="inline-flex items-center gap-3 rounded-full border-2 border-white/50 px-8 py-4 text-base font-bold text-white/80 hover:bg-white/10 transition"
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

      {/* ── Save-trip modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {saveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSaveModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
            >
              <button
                onClick={() => setSaveModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {!savedRouteId ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-sb-orange-500 mb-1">Save your trip</p>
                  <h2 className="text-2xl font-black text-sb-navy-900 mb-1">{template.name}</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {stops.map(s => s.city).join(' → ')} &bull; {stops.reduce((a, s) => a + s.duration, 0)} days
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Your name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={saveName}
                          onChange={e => setSaveName(e.target.value)}
                          placeholder="First name"
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sb-orange-400 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={saveEmail}
                          onChange={e => setSaveEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sb-orange-400 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Phone / WhatsApp <span className="text-gray-400 normal-case font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={savePhone}
                          onChange={e => setSavePhone(e.target.value)}
                          placeholder="+27 82 000 0000"
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sb-orange-400 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    {saveError && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{saveError}</p>
                    )}

                    <button
                      onClick={handleSaveTrip}
                      disabled={saveLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-sb-orange-500 hover:bg-sb-orange-600 disabled:opacity-60 px-6 py-3.5 text-sm font-bold text-white shadow transition"
                    >
                      {saveLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        : <><Bookmark className="w-4 h-4" /> Save my trip</>}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-black text-sb-navy-900 mb-2">Trip saved!</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Your trip is saved. Use this link to come back to it, or share it with South Bound.
                  </p>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                    <span className="flex-1 text-sm text-gray-700 truncate font-mono">{savedLink}</span>
                    <button
                      onClick={copyLink}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-sb-orange-600 hover:text-sb-orange-700 transition"
                    >
                      {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <a
                    href={savedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm font-semibold text-sb-orange-600 hover:text-sb-orange-700 transition"
                  >
                    Open trip page →
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
