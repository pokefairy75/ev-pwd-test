export type MapMemo = {
  id: string
  title: string
  content: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

export type MapMemoInput = Omit<MapMemo, 'id' | 'createdAt' | 'updatedAt'>
