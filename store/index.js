export const state = () => ({
  region: window.localStorage.getItem('region'),
})

export const mutations = {
  setRegion(state, region) {
    state.region = region
    window.localStorage.setItem('region', JSON.stringify(region))
  },
}
