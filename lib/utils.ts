const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diff = date.getTime() - now.getTime();
  const absolute = Math.abs(diff);

  if (absolute < 60 * 1000) {
    return "just now";
  }

  for (const [unit, ms] of UNITS) {
    if (absolute >= ms) {
      return relative.format(Math.round(diff / ms), unit);
    }
  }

  return "just now";
}
