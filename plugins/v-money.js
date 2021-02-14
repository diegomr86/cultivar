import Vue from 'vue'
import money from 'v-money'
Vue.use(money, { prefix: 'R$ ', decimal: ',', thousands: '', masked: false })
