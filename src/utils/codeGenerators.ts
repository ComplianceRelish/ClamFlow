import { format } from 'date-fns';

export function generateLotNumber(): string {
  const timestamp = format(new Date(), 'yyyyMMddHHmm');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LOT-${timestamp}-${random}`;
}

export function generateUserCode(): string {
  const prefix = 'USR';
  const timestamp = format(new Date(), 'yyMMdd');
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateSupplierCode(): string {
  const prefix = 'SUP';
  const timestamp = format(new Date(), 'yyMM');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateProductCode(type: 'shell-on' | 'meat'): string {
  const prefix = type === 'shell-on' ? 'SHO' : 'MEA';
  const timestamp = format(new Date(), 'yyMM');
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}