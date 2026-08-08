import { formatInTimeZone } from "date-fns-tz"
import { ImmichAsset } from '../types/immich/webhook'

const IMMICH_API_URL = process.env.IMMICH_API_URL
const IMMICH_API_KEY = process.env.IMMICH_API_KEY

if (!IMMICH_API_URL || !IMMICH_API_KEY) {
  throw new Error('IMMICH_API_URL and IMMICH_API_KEY must be set in env')
}

type ImmichRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function immichRequest<T = ImmichAsset>(
  path: string,
  { method = 'GET', body }: ImmichRequestOptions = {}
): Promise<T> {
  const url = `${IMMICH_API_URL}${path}`

  const response = await fetch(url, {
    method,
    headers: {
      'x-api-key': IMMICH_API_KEY as string,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`immich error ${response.status}: ${errorText}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : (undefined as T)
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