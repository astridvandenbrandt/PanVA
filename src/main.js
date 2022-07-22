import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import 'bootstrap'
import './assets/sass/custom.scss'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

////////////////////////////
//// other style sheets ////
////////////////////////////
// import 'bootstrap/dist/js/bootstrap.min.js'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import './assets/sass/main.scss'

const app = createApp(App)
// app.config.productionTip = false

app.use(store)
app.use(Antd)

app.mount('#app')
