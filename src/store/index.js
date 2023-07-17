import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    usuario: '',
  },
  getters: {

  },
  mutations: {
    actualizarUsuario(state, nuevoUsuario) {
      state.usuario = nuevoUsuario;
    },
  },
  actions: {

  },
  modules: {

  },
  plugins: 
  [createPersistedState({ 
    
    storage: window.sessionStorage 
    
  })], // Usa sessionStorage como almacenamiento
});
