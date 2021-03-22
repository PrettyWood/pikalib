<script lang="ts">
/**
 * This component is a visualizer for what is inject by VariablesBuckets.
 * 
 * Simply display it in the component you want to visualize the available
 * variables.
 * 
 * BETA: it also allows you to define new variables
 */

import { defineComponent } from "@vue/composition-api"

export default defineComponent({
  name: 'VariablesBucketVisualizer',
  inject: ['$tcVariables', '$tcSet', '$tcEmit'],
  data():{varName: string; newVarDef: string; } {
    return {varName: '', newVarDef: ''}
  },
  methods:{
    addVar() {
      const a = new Function(`
        return ${this.newVarDef}
      `);
      (this as any).$tcSet({[this.varName]: a}) 
    }
  }
})
</script>
<template>
  <div>
    Variables available:
    <pre>{{ $tcVariables }}</pre>
    <br />
    <hr />
    <br />
    <div>
      Add a new Variable:
      <br />
      <br />
      Name: <input v-model="varName"/>
      <br />
      <br />
      Definition: <input v-model="newVarDef"/>
      <br />
      <br />
      <center><button @click="addVar">Add Variable</button></center>
    </div>
  </div>
</template>