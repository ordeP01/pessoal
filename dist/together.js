const saoPauloCalendar = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

export function togetherDuration(startDate, now = Date.now()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(startDate);
  if (!match) throw new Error('Data de início inválida');

  const start = Date.parse(`${startDate}T00:00:00-03:00`);
  const elapsed = Math.max(0, now - start);
  const current = Object.fromEntries(
    saoPauloCalendar.formatToParts(new Date(now))
      .filter(part => ['year', 'month', 'day'].includes(part.type))
      .map(part => [part.type, Number(part.value)])
  );
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const months = Math.max(0,
    (current.year - year) * 12 + current.month - month - Number(current.day < day)
  );

  return {
    minutes: Math.floor(elapsed / 60000),
    hours: Math.floor(elapsed / 3600000),
    days: Math.floor(elapsed / 86400000),
    months
  };
}
