import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue';

Vue.use(VueCompositionAPI)
Vue.config.productionTip = false
Vue.config.performance = process.env.NODE_ENV === 'development';

new Vue({
  render: (h) => h(App),
}).$mount('#app');
