import { createStore } from 'vuex'

export default createStore({
  state: {
    usuario:"francooii"
  },
  getters: {
  },
  mutations: {
    actualizarUsuario(state, nuevoUsuario) {
      state.usuario = nuevoUsuario;
    }
  },
  actions: {
  },
  modules: {
  }
})


