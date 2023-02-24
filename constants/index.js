export function usdPretty (price) {
  return (
    <h3 className="money">
      <span className="align-top" style={{lineHeight: '1.7em', fontSize: '0.6em'}}>$</span>
        {String(price).slice(0, -2)}
      <span className="d-inline align-top" style={{lineHeight: '1.6em', fontSize: '0.6em'}}>{String(price).slice(-2)}</span>
    </h3>
  )
}

// get year or month from timestamp
//   month = YOUR_TIMESTAMP.slice(5, 7).replace(/^0+/, '')
//   year = YOUR_TIMESTAMP.slice(0, 4)



// Thank you @Steve8708 !
/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export function rtf(date, lang = navigator.language) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime()

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]

  // Array equivalent to the above but in the string representation of the units
  const units = ["second", "minute", "hour", "day", "week", "month", "year"]

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds))

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" })
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}