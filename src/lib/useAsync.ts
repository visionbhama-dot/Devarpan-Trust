import { useCallback, useEffect, useState } from 'react'

/** Runs an async loader on mount; returns data, loading, error and a refetch(). */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    let active = true
    setLoading(true)
    loader()
      .then((res) => {
        if (active) {
          setData(res)
          setError(null)
        }
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => run(), [run])

  return { data, loading, error, refetch: run }
}
