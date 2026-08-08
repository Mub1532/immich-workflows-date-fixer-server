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

export function toTZOffsetString(imageDate: string): string {
  const timeZone = process.env.TZ;
  return formatInTimeZone(new Date(imageDate), timeZone as string, "yyyy-MM-dd'T'HH:mm:ssxxx")
}

export function getUTCOffset(imageDate: string): string {
  const offset = formatInTimeZone(new Date(imageDate), process.env.TZ as string, 'xxx')
  const hours = parseInt(offset.slice(0, 3), 10)

  return hours === 0 ? 'UTC' : `UTC${hours > 0 ? '+' : ''}${hours}`
}