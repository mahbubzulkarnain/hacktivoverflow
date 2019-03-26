import Vue from 'vue';
import Vuex from 'vuex';
import api from './helpers/api';

Vue.use(Vuex);

const authSuccess = (commit, res) => {
  const { token } = res.data;
  const user = {
    id: res.data.id,
    username: res.data.username,
    email: res.data.email,
    fullname: res.data.fullname,
  };
  localStorage.setItem('xs', token);
  localStorage.setItem('xi', user.id);
  localStorage.setItem('xu', user.username);
  localStorage.setItem('xe', user.email);
  localStorage.setItem('xf', user.fullname);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  commit('auth_success', { token, user });
};

const authError = (commit) => {
  localStorage.removeItem('xs');
  localStorage.removeItem('xi');
  localStorage.removeItem('xu');
  localStorage.removeItem('xe');
  localStorage.removeItem('xf');
  commit('auth_error');
};

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.xs || '',
    user: {
      id: localStorage.xi || '',
      username: localStorage.xu || '',
      email: localStorage.xe || '',
      fullname: localStorage.xf || '',
    },
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, payload) {
      state.status = 'success';
      state.token = payload.token;
      state.user = payload.user;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        api
          .post('/auth/login', user)
          .then((res) => {
            authSuccess(commit, res);
            resolve(res);
          })
          .catch((err) => {
            authError(commit);
            reject(err);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        api
          .post('/auth/register', user)
          .then((res) => {
            authSuccess(commit, res);
            resolve(res);
          })
          .catch((err) => {
            authError(commit);
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.clear();
        delete api.defaults.headers.common.Authorization;
        resolve();
      });
    },
  },
  getters: {
    isLogin: state => !!state.token && !!state.user && !!state.user.id && !!state.user.fullname,
    authStatus: state => state.status,
    user: state => state.user,
  },
});
