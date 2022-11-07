import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { router } from './routers/'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus).use(router).use(pinia)
app.mount('#app')
