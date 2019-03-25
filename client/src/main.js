import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'

Vue.config.productionTip = false;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDudfijv8MZUyFT6zZO--XKYneI_UI84TM",
  authDomain: "hacktivoverflow-e87c1.firebaseapp.com",
  databaseURL: "https://hacktivoverflow-e87c1.firebaseio.com",
  projectId: "hacktivoverflow-e87c1",
  storageBucket: "hacktivoverflow-e87c1.appspot.com",
  messagingSenderId: "1044867472962"
};

firebase.initializeApp(config);

Vue.prototype.$auth = firebase.auth();
Vue.prototype.$db = firebase.firestore();

let app = ``;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
