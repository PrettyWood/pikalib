<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api"

export interface PokemonProps {
  name: string;
  hp: number;
}

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    hp: {
      type: Number,
      default: 100,
      validator: (hp: number) => 0 <= hp && hp <= 100,
    }
  },
  setup(props: PokemonProps) {
    return {
      state: computed(() => props.hp > 0 ? "alive" : "dead")
    }
  }
})
</script>

<template>
  <div class="pokemon" :class="`pokemon--${state}`">
    <h1>Pokemon {{ name }} (HP: {{hp}}/100)</h1>
  </div>
</template>

<style>
.pokemon {
  font-size: 30px;
}

.pokemon--alive {
  color: green;
}

.pokemon--dead {
  color: darkred;
}
</style>