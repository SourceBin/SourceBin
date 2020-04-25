import axios from 'axios';
import { languages } from '@sourcebin/linguist';

export async function classifySnippets(snippets: string[]): Promise<string[]> {
  if (snippets.length >= 1) {
    const { data } = await axios.post<string[]>(`http://${process.env.GENUS_CODICE_URL}/classify`, snippets);

    return data.map(language => languages[language]);
  }

  return [];
}
