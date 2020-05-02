import { parse as parseCookies } from 'cookie';

function parseSetCookies(cookies) {
  return cookies
    .map(cookie => cookie.split(';')[0])
    .reduce((obj, cookie) => ({
      ...obj,
      ...parseCookies(cookie),
    }), {});
}

function serializeCookies(cookies) {
  return Object
    .entries(cookies)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('; ');
}

function mergeSetCookies(oldCookies, newCookies) {
  const cookies = new Map();

  function add(setCookie) {
    const cookie = setCookie.split(';')[0];
    const name = Object.keys(parseCookies(cookie))[0];

    cookies.set(name, cookie);
  }

  oldCookies.forEach(add);
  newCookies.forEach(add);

  return [...cookies.values()];
}

export default function ({ $axios, res }) {
  $axios.onResponse((response) => {
    const setCookies = response.headers['set-cookie'];

    if (setCookies) {
      // Combine the cookies set on axios with the new cookies and serialize them
      const cookie = serializeCookies({
        ...parseCookies($axios.defaults.headers.common.cookie),
        ...parseSetCookies(setCookies),
      });

      $axios.defaults.headers.common.cookie = cookie; // eslint-disable-line no-param-reassign

      // If the res already has a Set-Cookie header it should be merged
      if (res.getHeader('Set-Cookie')) {
        const newCookies = mergeSetCookies(
          res.getHeader('Set-Cookie'),
          setCookies,
        );

        res.setHeader('Set-Cookie', newCookies);
      } else {
        res.setHeader('Set-Cookie', setCookies);
      }
    }
  });
}
