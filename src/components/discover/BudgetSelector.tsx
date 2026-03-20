'use client';

import { motion } from 'framer-motion';
import { BudgetKey } from '@/lib/tripTemplates';

export type { BudgetKey };

interface BudgetSelectorProps {
  selectedBudget: BudgetKey | null;
  onBudgetSelect: (budget: BudgetKey) => void;
  isCompact?: boolean;
}

interface BudgetOption {
  id: BudgetKey;
  label: string;
  sublabel: string;
  description: string;
  icon: string;
}

export default function BudgetSelector({ selectedBudget, onBudgetSelect, isCompact = false }: BudgetSelectorProps) {
  const budgets: BudgetOption[] = [
    {
      id: '15-25',
      label: 'R15k – R25k',
      sublabel: 'per month',
      description: 'Southeast Asia, Latin America, affordable cities with a great lifestyle',
      icon: '🌴',
    },
    {
      id: '25-35',
      label: 'R25k – R35k',
      sublabel: 'per month',
      description: 'Wider options across Europe, Asia, and South America with more comfort',
      icon: '✈️',
    },
    {
      id: '35+',
      label: 'R35k+',
      sublabel: 'per month',
      description: 'Premium cities, higher-end apartments, and bucket-list destinations',
      icon: '🌍',
    },
  ];

  return (
    <div className={`w-full transition-all duration-500 ${isCompact ? 'space-y-2' : 'space-y-4 sm:space-y-6'}`}>
      {/* Header */}
      <div className={`text-center transition-all duration-500 ${isCompact ? 'space-y-0.5' : 'space-y-2'}`}>
        {!isCompact && (
          <p className="text-xs font-bold text-sb-navy-400 uppercase tracking-widest">
            Step 2
          </p>
        )}
        <h3 className={`font-extrabold text-sb-navy-900 tracking-tight transition-all duration-500 ${
          isCompact ? 'text-base sm:text-xl' : 'text-xl sm:text-3xl'
        }`}>
          What&apos;s your monthly budget?
        </h3>
        {!isCompact && (
          <p className="text-sm sm:text-base text-sb-navy-600">
            Include rent, utilities, gym, food — everything
          </p>
        )}
      </div>

      {/* Budget Cards Grid */}
      <div className={`grid mx-auto w-full transition-all duration-500 ${
        isCompact
          ? 'grid-cols-3 gap-2 sm:gap-3 max-w-4xl'
          : 'grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl'
      }`}>
        {budgets.map((budget, index) => {
          const isSelected = selectedBudget === budget.id;
          return (
            <motion.button
              key={budget.id}
              onClick={() => onBudgetSelect(budget.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-col items-center justify-center text-center transition-all duration-500 border-2 ${
                isCompact
                  ? 'rounded-xl sm:rounded-2xl p-2 sm:p-5 gap-1 sm:gap-2'
                  : 'rounded-2xl sm:rounded-3xl p-6 sm:p-10 gap-3 sm:gap-4'
              } ${
                isSelected
                  ? 'bg-sb-navy-900 border-sb-orange-500 shadow-lg shadow-sb-navy-900/20'
                  : 'bg-white border-gray-100 hover:border-sb-navy-200 hover:shadow-md'
              }`}
            >
              <span className={`transition-all duration-500 ${isSelected ? 'scale-110' : ''} ${
                isCompact ? 'text-2xl sm:text-4xl' : 'text-4xl sm:text-6xl'
              }`}>
                {budget.icon}
              </span>
              <div>
                <div className={`font-extrabold leading-tight transition-all duration-500 ${
                  isCompact ? 'text-sm sm:text-xl mb-0' : 'text-xl sm:text-2xl mb-0.5'
                } ${isSelected ? 'text-white' : 'text-sb-navy-900'}`}>
                  {budget.label}
                </div>
                <div className={`font-medium transition-all duration-500 ${
                  isCompact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm mb-2'
                } ${isSelected ? 'text-white/60' : 'text-sb-navy-400'}`}>
                  {budget.sublabel}
                </div>
                {!isCompact && (
                  <div className={`hidden sm:block text-sm leading-relaxed transition-opacity duration-500 ${
                    isSelected ? 'text-white/80' : 'text-sb-navy-600'
                  }`}>
                    {budget.description}
                  </div>
                )}
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-2 -right-2 bg-sb-orange-500 text-white p-1 rounded-full shadow-md z-10 border-2 border-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
