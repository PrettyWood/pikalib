<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api"
// import { TcVariables } from '../variables-buckets/VariablesBucket';

import { Variables } from '../variables-buckets/VariablesBucket';

export default defineComponent({
  name: 'Instance',
  props: ['name'],
  inject: ['$tcVariables', '$tcSet'],
  // :poop: trick to force ts to detect the property `$tcVariables`
  computed: {
    $tcVariables(): Variables {
      return this.$tcVariables
    }
  },
  mounted(){
    (this as any).$tcSet({
      instanceName: this.name,
      'today': new Date(),
      'year'() { return this.today.getYear() },
      'month'() { return this.today.getMonth() },
      'day'() { return this.today.getDay() },
      'this-fail'() { return this.noExistingVar.plop },
    })
  },
})
</script>
<template>
  <div class="instance">
    Instance :: {{ name }}
    <pre>{{ $tcVariables }}</pre>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.instance {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
}
</style>
