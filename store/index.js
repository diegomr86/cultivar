export const state = () => {
  return {
    region: null,
    page_title: null,
    page_description: null,
    show_login: true,
  }
}

export const mutations = {
  setRegion(state, region) {
    state.region = region
  },
  setShowLogin(state, showLogin) {
    state.show_login = showLogin
  },
  setPageTitle(state, pageTitle) {
    state.page_title = pageTitle
  },
  setPageDescription(state, pageDescription) {
    state.page_description = pageDescription
  },
}
