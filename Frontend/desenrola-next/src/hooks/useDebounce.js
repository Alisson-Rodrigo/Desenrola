'use client';

import { useState, useEffect } from 'react';

/**
 * Hook de debounce: atrasa a atualização do valor até que o usuário
 * pare de digitar por X ms (delay).
 *
 * @param {any} value - valor a ser monitorado
 * @param {number} delay - tempo em ms para aguardar
 * @returns {any} - valor atualizado após o delay
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
