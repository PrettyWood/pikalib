<script lang="ts">
import { defineComponent } from "@vue/composition-api"

export default defineComponent({
  name: 'Story',
  props: ['id'],
  inject: ['$tcVariables', '$tcSet', '$tcParent'],
  // :poop:"trick to force ts to detect the property `$tcVariables`
  computed: {
    $tcVariables(): any {
      return this.$tcVariables
    },
    $tcSet(): any {
      return this.$tcSet
    },
    $tcParent(): any{
      return this.$tcParent
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
    Story :: {{ id }} -- {{ $tcVariables['my-requester-story-computed'] }}
    <br />
    {{ $tcVariables['my-requester-smallApp-computed']}}
    <br />
    <select name="regions" v-model="selected" @input="input" id="input">
      <option value="creuse">creuse</option>
      <option value="berry">berry</option>
      <option value="limousin">limousin</option>
    </select>

    <span 
      :class="{ hovered: $tcVariables.hovered }" 
      @mouseover="$tcParent.$tcSet({'hovered': true})" 
      @mouseout="$tcParent.$tcSet({'hovered': false})">
      Hover me ! 
    </span>
    <br>
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
