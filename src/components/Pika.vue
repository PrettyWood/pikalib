<script lang="ts">
import { defineComponent } from "@vue/composition-api"

export default defineComponent({
  props: {
    name: {
      type: String,
      required: false,
    },
  },
})
</script>

<template>
  <div class="pika">
    <span>Pika {{ name }}</span>
  </div>
</template>

<style lang="scss" scoped>
.pika {
  border: 1px solid black;
  padding: 10px;
}
</style>
