/**
 * Format currency values consistently across the application
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  }

  const symbol = currencySymbols[currency] || currency
  return `${symbol}${amount.toLocaleString()}`
}

/**
 * Format trip duration for display
 */
export function formatDuration(duration: string): string {
  // Add some smart formatting if needed
  return duration
}

/**
 * Generate a trip URL from slug
 */
export function getTripUrl(slug: string): string {
  return `/trips/${slug}`
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString)
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return date.toLocaleDateString('en-US', options || defaultOptions)
} 