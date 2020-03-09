import { beautify } from '@sourcebin/web-beautify';

onmessage = async (e) => {
  try {
    const beautified = await beautify(e.data.source, e.data.language);
    postMessage({ result: beautified });
  } catch (err) {
    postMessage({ error: err.message });
  }
};
