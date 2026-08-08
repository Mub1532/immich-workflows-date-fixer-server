import { formatInTimeZone } from 'date-fns-tz'

/**
 * Parses a filename like "20260807_120635.mp4"
 * and returns an ISO string with the correct BST/GMT offset for that date.
 * Returns null if the filename doesn't match the expected pattern.
 */
export function parseDateFromFilename(filename: string): string | null {
  const match = filename.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/)

  if (!match) return null

  const [, year, month, day, hour, minute, second] = match

  const localDateString = `${year}-${month}-${day}T${hour}:${minute}:${second}`

  const offset = formatInTimeZone(new Date(`${localDateString}Z`), process.env.TZ as string, 'xxx')

  return `${localDateString}${offset}`
}