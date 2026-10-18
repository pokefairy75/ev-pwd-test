import { useCallback, useEffect, useState } from 'react'
import { mapMemoRepository } from '../repository/mapMemoRepository'
import type { MapMemo } from '../types/mapMemo'

export function useMapMemos() {
  const [memos, setMemos] = useState<MapMemo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setMemos(await mapMemoRepository.getAll())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'メモを読み込めませんでした。')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { memos, loading, error, refresh }
}
