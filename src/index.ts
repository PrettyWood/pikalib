import Pokemon from './components/pokemon/index';

// import { App } from 'vue'

const components = {
  Pokemon,
}

function install(Vue: any) {
  for (const component of Object.values(components)) {
    Vue.component(component.name, component)
  }
}

export default { install }
export { default as Pokemon } from './components/pokemon/index';
