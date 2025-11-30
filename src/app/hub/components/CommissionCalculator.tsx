'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function CommissionCalculator() {
  const [clients, setClients] = useState(2);
  const [commission, setCommission] = useState(3500);

  const total = clients * commission;

  return (
    <Card className="p-6 bg-white border-stone-200 h-full">
      <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
        💰 Commission Calculator
      </h3>
      
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Clients per month</label>
            <input 
                type="range" 
                min="1" 
                max="10" 
                value={clients} 
                onChange={(e) => setClients(Number(e.target.value))}
                className="w-full accent-[#E86B32] h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-sm font-bold text-[#E86B32]">{clients} clients</div>
        </div>

        <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Avg. Commission</label>
            <select 
                value={commission} 
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E86B32]"
            >
                <option value="2500">R2 500 (Basic)</option>
                <option value="3500">R3 500 (Standard)</option>
                <option value="5000">R5 000 (Premium)</option>
            </select>
        </div>

        <div className="pt-4 mt-4 border-t border-stone-100">
            <div className="text-sm text-stone-500 mb-1">Estimated Monthly Earnings</div>
            <div className="text-3xl font-bold text-stone-800">
                R{total.toLocaleString()}
            </div>
        </div>
      </div>
    </Card>
  );
}

