<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api"

import { Variables, SCOPE } from '../types'

export default defineComponent({
  name: 'VariablesBucket',
  props: {
    scope: {
      type: String as PropType<SCOPE>,
      required: true,
    },
    variables: {
      type: Object as PropType<Variables>,
      default: (): Variables => ({}),
    }
  },
  computed: {
    allVariables(): Variables {
      return {
        ...this.$tcVariables as Variables,
        [`${this.scope}`]: this.$store.getters.$tcVariables[this.scope],
      }
    }
  },
  provide() {
    return {
      $tcVariables: this.allVariables
    }
  },
  inject: {
    $tcVariables: {
      default: {}
    }
  },
})
</script>

<template>
  <div class="variables-bucket">
    <strong>VariablesBucket (scope: {{ scope }})</strong>
    <pre>{{ allVariables }}</pre>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.variables-bucket {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
}
</style>
