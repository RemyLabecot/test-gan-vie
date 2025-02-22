export const toFullDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toMonthDayString = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
};

export function subtractMonths(currentMonth: string, monthsToSubtract: number): string {
  let [year, month] = currentMonth.split('-').map(Number);
  let date = new Date(year, month - 1);

  date.setMonth(date.getMonth() - monthsToSubtract);

  let newYear = date.getFullYear();
  let newMonth = (date.getMonth() + 1).toString().padStart(2, '0');

  return `${newYear}-${newMonth}`;
}
