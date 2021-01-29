<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import VariablesBucket from './components/VariablesBucket.vue';

export default defineComponent({
  components: { VariablesBucket },
  setup() {
    return {
      instanceVariables: {
        url: 'https://pika.toucantoco.guru',
        extra: {
          message: "Hey everyone"
        }
      },
      smallAppVariables: {
        name: 'mySmallApp',
        extra: {
          message: "Hey man"
        }
      },
      chapterVariables: {
        name: 'myChapter',
      },
      storyVariables: {
        id: 'myStory',
      }
    }
  }
})
</script>

<template>
  <div>
    <h1>Main app</h1>
    <VariablesBucket :scope="'instance'" :variables="instanceVariables">
      <VariablesBucket :scope="'smallApp'" :variables="smallAppVariables">
        <VariablesBucket :scope="'chapter'" :variables="chapterVariables">
          <VariablesBucket :scope="'story'" :variables="storyVariables" />
        </VariablesBucket>
      </VariablesBucket>
    </VariablesBucket>
  </div>
</template>
