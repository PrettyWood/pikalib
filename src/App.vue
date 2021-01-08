<script lang="ts">
import { defineComponent } from 'vue';

import Pokemon from './components/pokemon';
// import { Pokemon as Pokemon2 } from '../dist/pikalib.esm';

export default defineComponent({
  components: {
    Pokemon,
    // Pokemon2,
  },
})
</script>

<template>
  <div id="app">
    <h1>The app</h1>
    <Pokemon :name="'Pikachu'" />
    <!-- <Pokemon2 :name="'Bulbi'" :hp="0" /> -->
  </div>
</template>

<style scoped lang="scss">
#app {
  h1 {
    color: blue;
  }
}
</style>
