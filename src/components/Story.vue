<script lang="ts">
import { defineComponent } from "@vue/composition-api"
import { exec } from "node:child_process";
import {TcVariables} from '../variables-buckets/VariablesBucket';

export default defineComponent({
  name: 'Story',
  props: ['id'],
  inject: ['$tcVariables'],
  // :poop:"trick to force ts to detect the property `$tcVariables`
  computed: {
    $tcVariables(): TcVariables {
      return this.$tcVariables
    },
    state(): any {
      return this.$tcVariables.state
    }
  },
  mounted(){
    this.$tcVariables.set({
      storyId: this.id,
      'my-requester-story': 'creuse',
      'my-requester-story-computed'() {
        return `the story requester selected value is: ${this['my-requester-story']}`
      },
      'my-requester-story-and-smallApp-computed'() {
        return `story: ${this['my-requester-story']} - smallApp: ${this['my-requester-smallApp']}`
      }
    })
  },
  data: (): { selected: any; newVarDef: string, varName: string} => ({ 
    selected: 'creuse', 
    newVarDef: '', 
    varName: '' 
  }),
  methods:{
    input(a: any) {
      this.$tcVariables.set({'my-requester-story': a.target.value })
    },
    addVar() {
      const a = new Function(`
        return ${this.newVarDef}
      `);
      this.$tcVariables.set({[this.varName]: a}) 
    }
  }
})
</script>
<template>
  <div class="story">
    Story :: {{ id }}
    <pre>{{ state }}</pre>
    <select name="regions" v-model="selected" @input="input" id="input">
      <option value="creuse">creuse</option>
      <option value="berry">berry</option>
      <option value="limousin">limousin</option>
    </select>

    <br>
    <div>

      var name: <input v-model="varName"/>

      <textarea v-model="newVarDef"/>
      <button @click="addVar">Add Variable</button>
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
.story {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
}
</style>
