import { API_BASE_URL } from "./constants"

export class FetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "FetchError"
    this.status = status
  }
}

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    next: { revalidate: 60 },
    ...options,
  })

  if (!response.ok) {
    throw new FetchError(
      `Failed to fetch: ${response.statusText}`,
      response.status
    )
  }

  return response.json() as Promise<T>
}
