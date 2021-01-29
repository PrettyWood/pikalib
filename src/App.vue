<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import VariablesBucket from './components/VariablesBucket.vue';

export default defineComponent({
  components: { VariablesBucket },
})
</script>

<template>
  <div>
    <h1>Main app</h1>
    <VariablesBucket :scope="'instance'">
      <VariablesBucket :scope="'smallApp'">
        <VariablesBucket :scope="'chapter'">
          <VariablesBucket :scope="'story'" />
        </VariablesBucket>
      </VariablesBucket>
    </VariablesBucket>
  </div>
</template>
