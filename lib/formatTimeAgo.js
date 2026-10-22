const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "always" })

const UNITS = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
]

export function formatTimeAgo(date, now = new Date()) {
  const time = new Date(date).getTime()
  if (Number.isNaN(time)) return ""

  const seconds = Math.floor((now.getTime() - time) / 1000)
  if (seconds < 60) return "только что"

  for (const [unit, size] of UNITS) {
    if (seconds >= size) {
      return rtf.format(-Math.floor(seconds / size), unit)
    }
  }
  return "только что"
}
