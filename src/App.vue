<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Pokemon from './components/Pokemon.vue';

export default defineComponent({
  components: { Pokemon },
})
</script>

<template>
  <div id="app">
    <h1>The app</h1>
    <Pokemon :name="'Pikachu'" />
  </div>
</template>

<style scoped lang="scss">
#app {
  h1 {
    color: blue;
  }
}
</style>
