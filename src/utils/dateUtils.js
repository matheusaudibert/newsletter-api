// utils/dateUtils.js
// Funções para manipulação de datas

/**
 * Verifica se uma data ISO é o mesmo dia que hoje (ou data customizada)
 * @param {string} isoDateString
 * @param {Date} [compareDate = new Date()]
 * @returns {boolean}
 */
export function isSameDayISO(isoDateString, compareDate = new Date()) {
  const date = new Date(isoDateString);
  return (
    date.getDate() === compareDate.getDate() &&
    date.getMonth() === compareDate.getMonth() &&
    date.getFullYear() === compareDate.getFullYear()
  );
}

/**
 * Parseia parâmetros opcionais dia, mês, ano em um objeto Date
 * @param {string|number} day
 * @param {string|number} month
 * @param {string|number} year
 * @returns {Date|null} - Retorna null se data inválida
 */
export function parseDateParams(day, month, year) {
  if (!day || !month || !year) return null;
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
}
