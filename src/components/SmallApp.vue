<script lang="ts">
import { defineComponent } from "@vue/composition-api"
import { Variables } from '../variables-buckets/VariablesBucket';

export default defineComponent({
  name: 'SmallApp',
  props: ['name'],
  inject: ['$tcVariables', '$tcSet'],
  // :poop:"trick to force ts to detect the property `$tcVariables`
  computed: {
    $tcVariables(): Variables {
      return this.$tcVariables
    },
  },
  mounted(){
    (this as any).$tcSet({
      smallApp: this.name,
      'my-requester-smallApp': 'jjg',
      'my-requester-smallApp-computed'() {
        return `smallApp requester value: ${this['my-requester-smallApp']}`
      }
    })
  },
  data: (): { selected: any; newVarDef: string, varName: string} => ({ 
    selected: 'jjg', 
    newVarDef: '', 
    varName: '' 
  }),
  methods:{
    input(a: any) {
      (this as any).$tcSet({'my-requester-smallApp': a.target.value })
    },
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
  <div class="small-app">
    SmallApp :: {{ name }}
    <pre>{{ $tcVariables }}</pre>
    <select name="chanteurs" v-model="selected" @input="input" id="input">
      <option value="jjg">jjg</option>
      <option value="mika">mika</option>
      <option value="brassens">brassens</option>
    </select>

    <div>

      var name: <input v-model="varName"/>

      <textarea v-model="newVarDef"/>
      <button @click="addVar">Add Variable</button>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.small-app {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
}
</style>
