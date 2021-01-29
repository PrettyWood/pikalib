<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/composition-api"

export default defineComponent({
  name: 'VariablesBucket',
  props: {
    scope: {
      type: String,
      required: true,
    },
    variables: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    }
  },
  computed: {
    allVariables(): Record<string, any> {
      return {
        $tcVariables: {
          ...this.$tcVariables as object,
          [`${this.scope}`]: this.variables,
        }
      }
    }
  },
  provide() {
    return this.allVariables
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
