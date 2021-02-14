import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ptBR from '@/locale/pt_BR'
Vue.use(VeeValidate, {
  locale: 'pt_BR',
  fieldsBagName: 'veeFields',
  errorBagName: 'veeErrors',
})
Validator.localize('pt_BR', ptBR)
