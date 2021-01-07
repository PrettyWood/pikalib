import Pokemon from './Pokemon.vue'
import { App } from 'vue'

Pokemon.install = (Vue: App) => {
  Vue.component(Pokemon.name, Pokemon)
}

export default Pokemon