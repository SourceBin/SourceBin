const proxy = process.client ? `//proxy.${window.location.hostname}` : '';

function hexEncode(string) {
  let result = '';

  for (let i = 0; i < string.length; i += 1) {
    result += string.charCodeAt(i).toString(16);
  }

  return result;
}

export function signURL(url) {
  return window.$nuxt.$axios.$post(`${proxy}/sign/${hexEncode(url)}`);
}

export async function fileURL(url) {
  return `${proxy}/file/${await signURL(url)}`;
}

export async function proxyFile(url) {
  return window.$nuxt.$axios.$get(await fileURL(url));
}

export async function imageURL(url) {
  return `${proxy}/img/${await signURL(url)}`;
}
