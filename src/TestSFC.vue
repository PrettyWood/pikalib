<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Pokemon from './components/Pokemon.vue';
import { Pokemon as PokemonBuilt } from '../dist';

export default defineComponent({
    components: {
      Pokemon,
      PokemonBuilt,
    },
})
</script>

<template>
  <div class="MyApp">
    <PokemonBuilt />
    <Pokemon>
  </div>
</template>
