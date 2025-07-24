// Utility functions for Mozambique locale
export const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat('pt-MZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
  
  return `${formatted} MZN`;
};

export const formatCurrency = (value: number): string => {
  const formatted = new Intl.NumberFormat('pt-MZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  return `${formatted} MZN`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-MZ').format(value);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-MZ');
};

export const formatDateDetailed = (date: Date): string => {
  return date.toLocaleDateString('pt-MZ', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short' 
  });
};
