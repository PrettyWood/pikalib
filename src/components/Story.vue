<script lang="ts">
import { defineComponent } from "@vue/composition-api"
import {Variables} from '../variables-buckets/VariablesBucket';

export default defineComponent({
  name: 'Story',
  props: ['id'],
  inject: ['$tcVariables', '$tcSet', '$tcEmit'],
  // :poop:"trick to force ts to detect the property `$tcVariables`
  computed: {
    $tcVariables(): Variables {
      return this.$tcVariables
    },
    $tcSet(): any {
      return this.$tcSet
    },
    $tcEmit(): any{
      return this.$tcEmit
    }
  },
  mounted(){
    this.$tcSet({
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
      this.$tcSet({'my-requester-story': a.target.value })
    },
    addVar() {
      const a = new Function(`
        return ${this.newVarDef}
      `);
      this.$tcSet({[this.varName]: a}) 
    }
  }
})
</script>
<template>
  <div class="story">
    Story :: {{ id }}
    <pre>{{ $tcVariables }}</pre>
    <select name="regions" v-model="selected" @input="input" id="input">
      <option value="creuse">creuse</option>
      <option value="berry">berry</option>
      <option value="limousin">limousin</option>
    </select>

    <span 
      :class="{ hovered: $tcVariables.hovered }" 
      @mouseover="$tcEmit({'hovered': true})" 
      @mouseout="$tcEmit({'hovered': false})">
      Hover me ! 
    </span>
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

.hovered {
  font-weight: bold;
}
</style>
