export const money = (n: number): string => {
  const a = Math.abs(n);
  if (a >= 1e6) return `$${(n / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  if (a >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
};

export const moneyFull = (n: number): string => `$${Math.round(n).toLocaleString('en-US')}`;

export const years = (n: number): string => (n === 1 ? '1 year' : `${n} years`);
