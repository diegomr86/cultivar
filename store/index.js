export const state = () => ({
  region: !process.server ? window.localStorage.getItem('region') : null,
})

export const mutations = {
  setRegion(state, region) {
    state.region = region
    if (!process.server) {
      if (region) {
        window.localStorage.setItem('region', region)
      } else {
        window.localStorage.removeItem('region')
      }
    }
  },
}
