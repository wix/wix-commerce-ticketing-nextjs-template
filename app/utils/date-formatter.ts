const LOCALE = 'en-US';

export function formatDate(date: Date, timeZone: string): string {
  return Intl.DateTimeFormat(LOCALE, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    timeZone,
  }).format(date);
}

export function formatDateWithTime(date: Date, timeZone: string): string {
  return Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: '2-digit',
    minute: '2-digit',
    hour: 'numeric',
    year:
      new Date().getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
    timeZone,
  }).format(date);
}

export function getDatePart(
  date: Date,
  part: 'day' | 'month' | 'weekday',
  timeZone: string
): string {
  const value = part === 'day' ? '2-digit' : 'short';
  return Intl.DateTimeFormat(LOCALE, {
    [part]: value,
    timeZone,
  }).format(date);
}

interface FormatDuration {
  diffHrs: number;
  diffMins: number;
}

export const formatDuration = ({ diffHrs, diffMins }: FormatDuration) => {
  const showHours = diffHrs > 0;
  const diffValue = showHours ? diffHrs : diffMins;
  const minutesLeft = diffMins > 0 ? diffMins - diffHrs * 60 : 0;
  const shouldShowMinutesWithHours = showHours && minutesLeft !== 0;

  try {
    const numberFormat = new Intl.NumberFormat(LOCALE, {
      style: 'unit',
      unit: showHours ? 'hour' : 'minute',
      unitDisplay: 'long',
    } as any);

    const minuteFormatter = shouldShowMinutesWithHours
      ? new Intl.NumberFormat(LOCALE, {
          style: 'unit',
          unit: 'minute',
          unitDisplay: 'long',
        } as any)
      : null;

    return `${numberFormat.format(diffValue)} ${
      minuteFormatter ? minuteFormatter.format(minutesLeft) : ''
    }`.trim();
  } catch {
    return null;
  }
};

export function formatHours(date: Date, timeZone: string): string {
  return Intl.DateTimeFormat(LOCALE, {
    minute: '2-digit',
    hour: 'numeric',
    timeZone,
  }).format(date);
}
