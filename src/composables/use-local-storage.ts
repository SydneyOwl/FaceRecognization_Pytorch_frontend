import { reactive, watchEffect } from 'vue'

interface LocalStorage {
  key: string
  value: string
}
type KeyType = string

function hasKey(key: KeyType) {}

export function useLocalStorage(
  key: KeyType,
  initailValue?: string
) {
  const storage = reactive<LocalStorage>({
    key: key,
    value: initailValue ?? '',
  })
  if (localStorage.getItem(key)) {
    try {
      if(initailValue){
          throw Error(`LocalStorage already has a key named "${key}"! Failed to give it a initail value!`)
      }
      storage.value = localStorage.getItem(key) as string
    } catch (err) {
      console.log(err)
      storage.value = ''
    }
  }
  watchEffect(()=>{
    if(storage.value === null) {
      localStorage.removeItem(key)
    }
  })
  return storage
}
