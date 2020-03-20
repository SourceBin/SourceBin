import { eventBus } from '@/assets/eventBus.js';

export const fonts = [
  'Fantasque Sans Mono',
  'Fira Code',
  'Hack',
  'Inconsolata',
  'JetBrains Mono',
  'Roboto Mono',
  'Source Code Pro',
  'Sudo',
  'Ubuntu Mono',
];

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
