export function formatEventDescription(durationInMinutes: number, locale: string = "en") {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  
  const displayStyle = locale === 'ar' ? 'long' : 'short';
  
  const minFormatter = new Intl.NumberFormat(locale, { style: "unit", unit: "minute", unitDisplay: displayStyle });
  const hrFormatter = new Intl.NumberFormat(locale, { style: "unit", unit: "hour", unitDisplay: displayStyle });

  if (hours === 0) return minFormatter.format(minutes);
  if (minutes === 0) return hrFormatter.format(hours);
  return `${hrFormatter.format(hours)} ${minFormatter.format(minutes)}`;
}
export function formatTimezoneOffset(timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type == "timeZoneName")?.value;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

export function formatTimeString(date: Date) {
  return timeFormatter.format(date);
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(date: Date) {
  return dateTimeFormatter.format(date);
}
