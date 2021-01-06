import VueCompositionAPI from '@vue/composition-api'
import { createLocalVue, shallowMount } from '@vue/test-utils';

import Pokemon from '@/components/Pokemon.vue';

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);

describe('Pokemon', () => {
  it('should work', async () => {
    const wrapper = shallowMount(Pokemon, {
      propsData: {
        name: 'Pikachu',
      },
      localVue,
    });
    expect(wrapper).toMatchInlineSnapshot(
      `
      <div class="pokemon pokemon--alive">
        <h1>Pokemon Pikachu (HP: 100/100)</h1>
      </div>
    `,
    );
  });
});
