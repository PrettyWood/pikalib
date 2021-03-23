<script lang="ts">
import { defineComponent } from "@vue/composition-api"
import Modal from './Modal.vue';
import VariablesBucketVisualizer from '../variables-buckets/VariablesBucketVisualizer.vue';

export default defineComponent({
  name: 'Instance',
  components: {Modal, VariablesBucketVisualizer},
  props: ['name'],
  inject: ['$tcVariables', '$tcSet'],
  // :poop: trick to force ts to detect the property `$tcVariables`
  computed: {
    $tcVariables(): any {
      return this.$tcVariables
    }
  },
  data():{displayState: boolean} {
    return {displayState: false}
  },
  mounted(){
    (this as any).$tcSet({
      instanceName: this.name,
      'today': new Date(),
      async asyncVar() { 
        function resolveAfter2Seconds() {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve('a');
            }, 2000);
          });
        }
        const a = await resolveAfter2Seconds();
        return 'resolved async function'
      },
      'year'() { return this.today.getYear() },
      'month'() { return this.today.getMonth() },
      'day'() { return this.today.toISOString().slice(0, 10) },
      'this-fail'() { return this.noExistingVar.plop },
    })
  },
})
</script>
<template>
  <div class="instance">
    <button @click="displayState=true">Display vars</button>
    <br/>
    <br/>
    <Modal v-if="displayState" @closed="displayState=false">
      <VariablesBucketVisualizer />
    </Modal>
    Instance :: {{ name }} -- Day: {{ $tcVariables.day }}
    <br/>
    Async var: {{ $tcVariables.asyncVar }}
    <br/>
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
