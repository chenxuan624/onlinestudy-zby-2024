// import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/global.css'

// createApp(App).mount('#app')
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
