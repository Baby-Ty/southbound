/**
 * Currency conversion utilities
 * Converts USD prices to ZAR (South African Rand)
 */

const USD_TO_ZAR_RATE = 18.5; // Approximate exchange rate

/**
 * Convert USD price string to ZAR price string
 * Handles formats like: "$900 - $1,500", "$1,200", "$2,200 - $3,000/month"
 */
export function usdToZar(usdPrice: string): string {
  // Extract numbers from the price string
  const numbers = usdPrice.match(/\$?([\d,]+)/g);
  if (!numbers || numbers.length === 0) {
    return usdPrice; // Return original if no numbers found
  }

  // Convert each number
  const zarNumbers = numbers.map(num => {
    // Remove $ and commas, convert to number
    const cleanNum = parseInt(num.replace(/[$,]/g, ''));
    if (isNaN(cleanNum)) return num;
    
    // Convert to ZAR and format with commas
    const zarAmount = Math.round(cleanNum * USD_TO_ZAR_RATE);
    return zarAmount.toLocaleString('en-ZA');
  });

  // Replace USD numbers with ZAR numbers in the original string
  let result = usdPrice;
  numbers.forEach((usdNum, index) => {
    result = result.replace(usdNum, `R${zarNumbers[index]}`);
  });

  // Replace $ with R if there are any remaining
  result = result.replace(/\$/g, 'R');
  
  // Remove "USD" or "usd" if present
  result = result.replace(/\b(USD|usd)\b/gi, 'ZAR');
  
  return result;
}

/**
 * Convert USD amount to ZAR amount (for calculations)
 */
export function usdToZarAmount(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_ZAR_RATE);
}

/**
 * Format ZAR amount with currency symbol
 */
export function formatZar(amount: number): string {
  return `R${amount.toLocaleString('en-ZA')}`;
}

