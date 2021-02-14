import { setAxios } from '~/api/api'

export default ({ app }, inject) => {
  setAxios(app.$axios)
}
