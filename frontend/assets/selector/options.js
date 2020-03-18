import { linguist } from '@sourcebin/linguist';
import themes from '@sourcebin/themes';

export const languageOptions = Object
  .entries(linguist)
  .map(([id, language]) => ({
    name: language.name,
    aliases: language.aliases,
    data: Number(id),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const themeOptions = Object
  .entries(themes)
  .map(([theme, [name]]) => ({
    name,
    data: theme,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
