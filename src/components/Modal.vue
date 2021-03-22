<script lang="ts">
import { defineComponent } from "@vue/composition-api"

export default defineComponent({
  name: 'Modal',
})
</script>
<template>
  <div class="filter">
    <div class="content" >
      <div @click="$emit('closed')" class="close"><button>x</button></div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  background: rgba(1, 1, 1, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.close{
  text-align: right;
}

.content {
  margin: auto;
  width: 50%;
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
