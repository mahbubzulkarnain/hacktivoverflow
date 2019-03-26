import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './helpers/api';

import WithSidebar from './components/layout/WithSidebar.vue';
import WithoutSidebar from './components/layout/WithoutSidebar.vue';

Vue.component('WithSidebar', WithSidebar);
Vue.component('WithoutSidebar', WithoutSidebar);

Vue.config.productionTip = false;
Vue.prototype.webname = 'HacktivOverflow';

Vue.prototype.$api = api;

if (localStorage.xs) {
  Vue.prototype.$api.defaults.headers.common.Authorization = `Bearer ${localStorage.xs}`;
}

Vue.prototype.webname = 'HacktivOverflow';
document.title = 'HacktivOverflow';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
