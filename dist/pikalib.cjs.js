'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

var script = vue.defineComponent({
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
            state: vue.computed(() => props.hp > 0 ? "alive" : "dead")
        };
    }
});

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock("div", {
    class: ["pokemon", `pokemon--${_ctx.state}`]
  }, [
    vue.createVNode("h1", null, "Pokemon " + vue.toDisplayString(_ctx.name) + " (HP: " + vue.toDisplayString(_ctx.hp) + "/100)", 1 /* TEXT */)
  ], 2 /* CLASS */))
}

script.render = render;
script.__file = "src/components/Pokemon.vue";

exports.Pokemon = script;
//# sourceMappingURL=pikalib.cjs.js.map
