export const state = () => {
  return {
    region: null,
    page_title: null,
    page_description: null,
  }
}

export const mutations = {
  setRegion(state, region) {
    state.region = region
  },
  setPageTitle(state, pageTitle) {
    state.page_title = pageTitle
  },
  setPageDescription(state, pageDescription) {
    state.page_description = pageDescription
  },
}
