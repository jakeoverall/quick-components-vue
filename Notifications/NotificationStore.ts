
export default {
  state: {
    notifications: []
  },
  mutations: {
    clearNotification(state, notification) {
      let i = state.notifications.indexOf(notification)
      if (i > -1) {
        state.notifications.splice(i, 1)
      }
    },
    addNotification(state, notification) {
      state.notifications.push(notification)
    }
  },
  actions: {
    addNotification({ commit, dispatch }, notification) {
      if (!commit) {
        commit = (fn, payload) => {
          this.mutations[fn].bind(null, this.state)(payload)
        }
      }
      if (!notification) { return }
      dispatch('_destroyAfter', notification)
      commit('addNotification', notification)
    },
    _destroyAfter({ commit, dispatch }, notification) {
      setTimeout(() => {
        if (notification.paused) {
          return dispatch('_destroyAfter', notification)
        }
        commit('clearNotification', notification)
      }, 3500)
    }
  }
}
