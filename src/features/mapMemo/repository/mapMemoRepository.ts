import type { MapMemo, MapMemoInput } from '../types/mapMemo'

const DATABASE_NAME = 'personal-pwa'
const DATABASE_VERSION = 1
const STORE_NAME = 'mapMemos'

let databasePromise: Promise<IDBDatabase> | undefined

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => database.close()
      resolve(database)
    }
    request.onerror = () => {
      databasePromise = undefined
      reject(request.error ?? new Error('IndexedDBを開けませんでした。'))
    }
    request.onblocked = () => {
      databasePromise = undefined
      reject(new Error('別のタブがデータベースを使用中です。ページを再読み込みしてください。'))
    }
  })

  return databasePromise
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('データを読み込めませんでした。'))
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(transaction.error ?? new Error('データの保存に失敗しました。'))
    transaction.onerror = () => reject(transaction.error ?? new Error('データの保存に失敗しました。'))
  })
}

export const mapMemoRepository = {
  async getAll(): Promise<MapMemo[]> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const result = await requestResult(transaction.objectStore(STORE_NAME).getAll())
    return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  async getById(id: string): Promise<MapMemo | undefined> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readonly')
    return requestResult(transaction.objectStore(STORE_NAME).get(id))
  },

  async create(input: MapMemoInput): Promise<MapMemo> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const now = new Date().toISOString()
    const memo: MapMemo = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    transaction.objectStore(STORE_NAME).add(memo)
    await transactionDone(transaction)
    return memo
  },

  async update(id: string, input: MapMemoInput): Promise<MapMemo> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const existing = await requestResult(store.get(id)) as MapMemo | undefined
    if (!existing) {
      transaction.abort()
      throw new Error('このメモは見つかりませんでした。')
    }
    const memo: MapMemo = { ...existing, ...input, updatedAt: new Date().toISOString() }
    store.put(memo)
    await transactionDone(transaction)
    return memo
  },

  async delete(id: string): Promise<void> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(id)
    await transactionDone(transaction)
  },
}
