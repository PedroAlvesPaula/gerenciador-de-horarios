import { BadRequestException } from '@nestjs/common';

export const BUSINESS_TIME_ZONE =
  process.env.BUSINESS_TIME_ZONE ?? 'America/Sao_Paulo';

export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

interface ZonedDateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const zonedFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const getZonedParts = (date: Date): ZonedDateTimeParts => {
  const values = Object.fromEntries(
    zonedFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
};

const pad = (value: number): string => String(value).padStart(2, '0');

export const isValidDateOnly = (value: string): boolean => {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const assertValidDateOnly = (value: string): void => {
  if (!isValidDateOnly(value)) {
    throw new BadRequestException('Invalid date. Use the YYYY-MM-DD format.');
  }
};

export const timeToMinutes = (value: string): number => {
  if (!TIME_PATTERN.test(value)) {
    throw new BadRequestException('Invalid time. Use the HH:mm format.');
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (value: number): string =>
  `${pad(Math.floor(value / 60))}:${pad(value % 60)}`;

export const addDaysToDateOnly = (value: string, days: number): string => {
  assertValidDateOnly(value);
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}`;
};

export const dateOnlyToUtc = (value: string): Date => {
  assertValidDateOnly(value);
  return new Date(`${value}T00:00:00.000Z`);
};

export const formatDateInBusinessTimeZone = (date: Date): string => {
  const parts = getZonedParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
};

export const formatTimeInBusinessTimeZone = (date: Date): string => {
  const parts = getZonedParts(date);
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
};

const getTimeZoneOffset = (date: Date): number => {
  const parts = getZonedParts(date);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return representedAsUtc - date.getTime();
};

export const businessDateTimeToUtc = (
  dateValue: string,
  timeValue: string,
): Date => {
  assertValidDateOnly(dateValue);
  timeToMinutes(timeValue);

  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour, minute] = timeValue.split(':').map(Number);
  const requestedWallClock = Date.UTC(year, month - 1, day, hour, minute);

  let result = new Date(requestedWallClock);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    result = new Date(requestedWallClock - getTimeZoneOffset(result));
  }

  return result;
};

export const getBusinessDayRange = (
  dateValue: string,
): { start: Date; end: Date } => ({
  start: businessDateTimeToUtc(dateValue, '00:00'),
  end: businessDateTimeToUtc(addDaysToDateOnly(dateValue, 1), '00:00'),
});

export const getDayOfWeek = (dateValue: string): number => {
  assertValidDateOnly(dateValue);
  return dateOnlyToUtc(dateValue).getUTCDay();
};
