export const state = () => {
  return {
    region: null,
  }
}

export const mutations = {
  setRegion(state, region) {
    state.region = region
  },
}
