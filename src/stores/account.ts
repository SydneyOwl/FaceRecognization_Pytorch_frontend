import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    isLogin: false,
    username: '',
    password: '*****',
  }),
  actions:{
    confirmIsLogin() {
      this.isLogin = true
    },
    
  }
})
