import { useState, useCallback } from 'react';

export type MaskType = 'currency-brl' | 'currency-usd' | 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date';

// Máscaras
export const maskCurrencyBRL = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  const number = (parseFloat(numeric) || 0) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const maskCurrencyUSD = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  const number = (parseFloat(numeric) || 0) / 100;
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
};

export const maskCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .substring(0, 18);
};

export const maskPhone = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  if (numeric.length <= 10) {
    return numeric
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return numeric
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

export const maskCEP = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 9);
};

export const maskDate = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 10);
};

const applyMask = (value: string, mask?: MaskType): string => {
  if (!mask) return value;

  switch (mask) {
    case 'currency-brl':
      return maskCurrencyBRL(value);
    case 'currency-usd':
      return maskCurrencyUSD(value);
    case 'cpf':
      return maskCPF(value);
    case 'cnpj':
      return maskCNPJ(value);
    case 'phone':
      return maskPhone(value);
    case 'cep':
      return maskCEP(value);
    case 'date':
      return maskDate(value);
    default:
      return value;
  }
};

export const useMask = (initialValue: string = '', mask?: MaskType) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    (newValue: string) => {
      const masked = applyMask(newValue, mask);
      setValue(masked);
      return masked;
    },
    [mask]
  );

  return {
    value,
    setValue: handleChange,
  };
};
