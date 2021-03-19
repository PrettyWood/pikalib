<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Instance from './components/Instance.vue';
import Story from './components/Story.vue';
import SmallApp from './components/SmallApp.vue';
import VariablesBucket from './variables-buckets/VariablesBucket';

export default defineComponent({
  components: { VariablesBucket, Instance, Story, SmallApp },
})
</script>

<template>
  <div>
    <h1>Main app</h1>
    <VariablesBucket>
      <Instance :name="'renault'">
        <VariablesBucket>
          <SmallApp :name="'vente pr'">
            <VariablesBucket>
              <Story :id="332020"/>
            </VariablesBucket>
            <VariablesBucket>
              <Story :id="2199"/>
            </VariablesBucket>
          </SmallApp>
        </VariablesBucket>
      </Instance>
    </VariablesBucket>
  </div>
</template>
