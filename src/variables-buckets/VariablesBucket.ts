import { defineComponent, PropType } from "@vue/composition-api"
import {  VNode } from "vue/types/umd"

import { Variables, SCOPE } from '../types'
import { VariablesBucket, VariablesBucketCreator } from "./variables-buckets";

type Definitions = Record<string, any>;
export interface TcVariables {
  state: Record<string, any>;
  set: (args: Definitions) => void;
}

export default defineComponent({
  name: 'VariablesBucket',
  data(): { definitions: Record<string, any>; state: Record<string, any>; } {
    return {
      definitions: {
        __trick__: '__trick_value__'
      },
      state: {},
    }
  },
  computed: {
    definitionsHierarchy(): Definitions[] {
      return [...this.__definitionsHierarchy__, this.definitions]
    },
    tcVariables(): TcVariables {
      return {
        state: this.state, 
        set:(args: Definitions) => {
          for (const [k, v] of Object.entries(args)){
            this.$set(this.definitions, k, v)
          }
          this.$set(this.definitions, '__trick__', `${Math.random()}`.slice(2,-1))
        }
      }
    }
  },
  watch: {
    definitionsHierarchy: {
      handler(newDefinitionsHierarchy) {
        let temp: VariablesBucket = VariablesBucketCreator();
        for(const def of newDefinitionsHierarchy){
          temp = VariablesBucketCreator(temp).set(def)
        }
        for (const [k, v] of Object.entries(temp.state)){
          this.$set(this.state, k, v)
        }
        this.$set(this.state, '__trick__', `${Math.random()}`.slice(2,-1))
      },
      deep: true,
      immediate: true,
    }
  },
  provide() {
    return {
      $tcVariables: this.tcVariables,
      __definitionsHierarchy__: this.definitionsHierarchy,
    }
  },
  inject: {
    $tcVariables:{
      default: {set:() => undefined}
    },
    __definitionsHierarchy__: {
      default: [] as Definitions[]
    }
  },
  render(): VNode {
    return this.$slots.default![0]
  },
})
