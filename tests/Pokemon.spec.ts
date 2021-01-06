import { shallowMount } from '@vue/test-utils';

import Pokemon from '@/components/Pokemon.vue';

describe('Pokemon', () => {
  it('should work', async () => {
    const wrapper = shallowMount(Pokemon, {
      props: {
        name: 'Pikachu'
      }
    });
    expect(wrapper.element).toMatchInlineSnapshot(
      `
      <div
        class="pokemon pokemon--alive"
      >
        <h1>
          Pokemon Pikachu (HP: 100/100)
        </h1>
      </div>
    `,
    );
  });
});
