import { defineComponent } from "@vue/composition-api"
import Vue, { VNode } from "vue";

export type Variables = Record<string, any>;

// TODO: write a complete docstring on how this component works.
export default defineComponent({
  name: 'VariablesBucket',
  data(): { tcVariables: Variables; definitions : any} { 
    return { tcVariables: {}, definitions:{} }
  },
  computed: {
    parentTcVariables(): Variables {
      return this.$tcVariables
    },
  },
  methods: {
    // TODO: find a better name than `computeTcVariables`
    computeTcVariables(args: Record<string, any> = {}){
      const temp: Record<string, any> = {}
      const allArgs = { ...this.parentTcVariables, ...this.definitions, ...args}
      
      // `definitions` contains function defining variables of the current bucket
      // --> These definitions must be saved to be re-computed at each `$tcSet`.
      // Note that `definitions` does not need to be reactives, so do not use Vue.set
      this.definitions = {...this.definitions, ...args};

      for(const [k, v] of Object.entries(allArgs)){
        Object.defineProperty(
          temp,
          k, { get: v instanceof Function ? v.bind(temp) : () => v}
        )
      }
      for(const k of Object.keys(allArgs)){
        try {
          // QUESTION: Is the variables asynchone ?
          if(['Promise', 'AsyncFunction'].includes(temp[k].constructor.name)){
            // YES: Set 'loading...' as value
            Vue.set(this.tcVariables, k, 'loading...');
            // We do not want to make not asynchrone variables await, so we use the `then` method
            temp[k].then((res: any)=>{
              // And when it is finished, set the result
              Vue.set(this.tcVariables, k, res);
            })
          } else {
            // NO: simply set the value into the object:
            Vue.set(this.tcVariables, k, temp[k]);
          }
        } catch(e){
          Vue.set(this.tcVariables, k, `Error :: ${e.message}`);
        }
      }
    }
  },
  watch: {
    parentTcVariables: {
      handler(){
        this.computeTcVariables();
      },
      deep: true,
      immediate: true,
    }
  },
  provide() {
    return {
      $tcVariables: this.tcVariables,
      $tcSet: this.computeTcVariables,
      $tcEmit: this.$tcSet // <-- tcSet of the parent !
    }
  },
  inject: {
    $tcVariables: {
      default: {} as Variables,
    },
    $tcSet: {
      default: () => {}
    }
  },
  render(): VNode {
    return this.$slots.default![0]
  },
})
