import Vue from 'vue';
import Vuex from 'vuex'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(Vuex)
Vue.use(VueCompositionAPI)
Vue.config.productionTip = false
Vue.config.performance = process.env.NODE_ENV === 'development';

import App from './App.vue';

const store = new Vuex.Store({
  state: {
    $tcVariables: {
      instance: {
        url: 'https://pika.toucantoco.guru',
        extra: {
          message: "Hey everyone"
        }
      },
      smallApp: {
        name: 'mySmallApp',
        extra: {
          message: "Hey man"
        }
      },
      chapter: {
        name: 'myChapter'
      },
      story: {
        id: 'myStore'
      }
    }
  },
  getters: {
    $tcVariables(state) {
      return state.$tcVariables
    }
  }
})

new Vue({
  render: (h) => h(App),
  store,
}).$mount('#app');
