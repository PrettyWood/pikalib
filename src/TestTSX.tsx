import { defineComponent } from '@vue/composition-api';

import { Pokemon } from '../dist';

export default defineComponent({
    components: { Pokemon },
    setup() {
      return () => (
        <div class="MyApp">
          {/* missing required name */}
          <Pokemon />
          {/* wrong type name */}
          <Pokemon name={3} />
          {/* perfect */}
          <Pokemon name={"ok"} />
        </div>
      )
    }
})
