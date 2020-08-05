const proxy = process.client ? `//proxy.${window.location.hostname}` : '';

export function signURL(url) {
  return window.$nuxt.$axios.$post(`${proxy}/sign/${btoa(url)}`);
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
