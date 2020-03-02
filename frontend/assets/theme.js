import themes from '@sourcebin/themes';

import { eventBus } from '@/assets/eventBus.js';
import { themeOptions } from '@/assets/selector/options.js';

export function getThemeName(theme) {
  return themes[theme];
}

export function promptThemeSelect(store) {
  return new Promise((res) => {
    eventBus.$emit('promptSelect', 'Theme Selector', themeOptions, (theme) => {
      if (theme !== undefined) {
        store.commit('settings/setTheme', theme);
      }

      res(theme);
    });
  });
}
