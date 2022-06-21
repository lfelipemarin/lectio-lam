import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import Moment from 'moment';
import VueAnalytics from 'vue-analytics';
let SocialSharing = require('vue-social-sharing');

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
firebase.initializeApp(firebaseConfig);
// Required for side-effects
require('firebase/firestore');
const db = firebase.firestore();

db.enablePersistence().catch(function(err) {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});

Vue.config.productionTip = false;
Vue.use(SocialSharing);
Vue.use(VueCompositionAPI);
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GA_ID,
  router,
});

sync(store, router);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');

Moment.updateLocale('es', {
  week: {
    dow: 6,
  },
});
Moment.locale('es');
Vue.prototype.$moment = Moment;

// Cut or truncate text
Vue.filter('truncate', function(text, stop, clamp) {
  return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '');
});
