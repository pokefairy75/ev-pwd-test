const DATABASE_NAME = 'personal-pwa-settings'
const DATABASE_VERSION = 1
const STORE_NAME = 'settings'
const API_KEY_SETTING = 'googleMapsApiKey'

let databasePromise: Promise<IDBDatabase> | undefined

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => database.close()
      resolve(database)
    }
    request.onerror = () => {
      databasePromise = undefined
      reject(request.error ?? new Error('設定用データベースを開けませんでした。'))
    }
    request.onblocked = () => {
      databasePromise = undefined
      reject(new Error('別のタブが設定用データベースを使用中です。ページを再読み込みしてください。'))
    }
  })

  return databasePromise
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('設定を読み込めませんでした。'))
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(transaction.error ?? new Error('設定の保存に失敗しました。'))
    transaction.onerror = () => reject(transaction.error ?? new Error('設定の保存に失敗しました。'))
  })
}

export const googleMapsSettingsRepository = {
  async getApiKey(): Promise<string> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readonly')
    return (await requestResult(transaction.objectStore(STORE_NAME).get(API_KEY_SETTING))) ?? ''
  },

  async saveApiKey(apiKey: string): Promise<void> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(apiKey, API_KEY_SETTING)
    await transactionDone(transaction)
  },

  async deleteApiKey(): Promise<void> {
    const database = await openDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(API_KEY_SETTING)
    await transactionDone(transaction)
  },
}
