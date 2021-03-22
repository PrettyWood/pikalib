/**
 * `VariablesBucket` is a render-less component which provides to all its children:
 *   - `$tcVariables`: an object mapping: key = variable name, value = variable value
 *   - `$tcSet`: a function to create / update in the `$tcVariables` object
 *   - `$tcEmit`: same function than `$tcSet` but for the parent variable bucket.
 *
 * All components under `VariablesBucket` can inject these 3 objects and use it.
 * cf. https://vuejs.org/v2/api/#provide-inject
 * 
 * `VariablesBucket` himself injects them to make the provided `$tcVariables`
 * inherit from all buckets above him !
 *
 *
 * Variables in `$tcVariables` are set using either:
 * - a value (number, string etc.)
 * - a function bind to the `$tcVariables` object **so it can depend on other variable
 * like a js getter.**
 * `$tcVariables` give the result of these functions. However, each time we want
 * to set a new variable we need to call again all these functions. For this reason,
 * we store them in the state of the component under the date `definitions`.
 *
 */
import { defineComponent } from "@vue/composition-api"
import Vue, { VNode } from "vue";

export default defineComponent({
  name: 'VariablesBucket',
  data(): {
    /** `tcVariables` is the object provided to the children components.
     * It MUST be a Vue data and it MUST be updated using `Vue.set` to be reactive.
     * cf. https://vuejs.org/v2/guide/reactivity.html
     */
    tcVariables: Record<string, any>;
    /** `definitions` stores all variables definitions.
     * IMPORTANT: these "definitions" must be saved to be re-computed at each `$tcSet`.
     */
    definitions : Record<string, any>
  } {
    return {
      tcVariables: {},
      definitions:{}
    }
  },
  computed: {
    parentTcVariables(): Record<string, any> {
      return this.$tcVariables // <-- This comes from the `VariablesBucket` above (cf.`inject` below)
    },
  },
  methods: {
    computeTcVariables(args: Record<string, any> = {}){
      const allArgs = { ...this.parentTcVariables, ...this.definitions, ...args}
      
      // Note that `definitions` does not need to be reactive, so do not use Vue.set
      this.definitions = {...this.definitions, ...args};
      
      /** In the following "for loop" we set all variables as getter of the `temp` object
       * in order to handle variables dependencies
       */
      const temp: Record<string, any> = {}
      for(const [k, v] of Object.entries(allArgs)){
        // k = variable name
        // v = variable definition
        Object.defineProperty(
          temp,
          k, { get: v instanceof Function ? v.bind(temp) : () => v} // if the definition is not a function, create one which return the value
        )
      }
      
      /** In the following "for loop", we get from the `temp` object all variables,
       * and Vue.set them into the `tcVariables` data.
       */
      for(const k of Object.keys(allArgs)){
        try {
          // QUESTION: Is the variables asynchronous ?
          if(['Promise', 'AsyncFunction'].includes(temp[k].constructor.name)){
            // YES: Set 'loading...' as value
            Vue.set(this.tcVariables, k, 'loading...');
            // We do not want to make not asynchronous variables await, so we use the `then` method
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
    parentTcVariables: { // If parent buckets update the 
      handler(){
        this.computeTcVariables();
      },
      deep: true,
      immediate: true,
    }
  },
  provide() {
    return {
      $tcVariables: this.tcVariables, // Provide `tcVariables` to the children components
      $tcSet: this.computeTcVariables,
      $tcEmit: this.$tcSet // Provide the `$tcSet` function of the `VariablesBucket` above
    }
  },
  inject: {
    $tcVariables: { // <-- This comes from the `VariablesBucket` above
      default: {} as Record<string, any>, // <-- The "Root" `$tcVariables` component inherit from an empty object.
    },
    $tcSet: { // <-- This comes from the `VariablesBucket` above
      default: () => {}
    }
  },
  render(): VNode {
    return this.$slots.default![0]
  },
})
