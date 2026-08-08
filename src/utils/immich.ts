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