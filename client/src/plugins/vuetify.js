import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import es from 'vuetify/es5/locale/es'


export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  lang: {
    locales: { es },
    current: 'es'
  }
});
