import { defineComponent, computed, openBlock, createBlock, createVNode, toDisplayString } from 'vue';

var script = defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
        hp: {
            type: Number,
            default: 100,
            validator: (hp) => 0 <= hp && hp <= 100,
        }
    },
    setup(props) {
        return {
            state: computed(() => props.hp > 0 ? "alive" : "dead")
        };
    }
});

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: ["pokemon", `pokemon--${_ctx.state}`]
  }, [
    createVNode("h1", null, "Pokemon " + toDisplayString(_ctx.name) + " (HP: " + toDisplayString(_ctx.hp) + "/100)", 1 /* TEXT */)
  ], 2 /* CLASS */))
}

script.render = render;
script.__file = "src/components/Pokemon.vue";

export { script as Pokemon };
//# sourceMappingURL=pikalib.esm.js.map
