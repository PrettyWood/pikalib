<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Pika from './components/Pika.vue';

export default defineComponent({
  components: { Pika },
})
</script>

<template>
  <Pika :name="'0'" />
</template>
