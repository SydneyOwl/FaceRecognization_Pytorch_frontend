import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settings', {
  state: () => ({
    videoRatio: '4/3',
    captureFace: false,
  }),
  actions:{
    
  }
})
