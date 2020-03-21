import { eventBus } from '@/assets/eventBus.js';

export function promptFontSelect(store) {
  return new Promise((res) => {
    eventBus.$emit('promptFontSelect', (font) => {
      if (font !== undefined) {
        store.commit('settings/setFont', font);
      }

      res(font);
    });
  });
}
