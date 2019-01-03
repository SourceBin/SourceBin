const source = function(nameOrObj, value) {
  if (typeof nameOrObj === 'object') {
    Object.entries(nameOrObj).forEach(([name, value]) => {
      if (source[name] !== undefined) throw new Error(`'${name}' is already defined`);
      source[name] = value;
    });
  } else {
    if (source[nameOrObj] !== undefined) throw new Error(`'${nameOrObj}' is already defined`);
    source[nameOrObj] = value;
  }
}

source.update = (nameOrObj, value) => {
  if (typeof nameOrObj === 'object') {
    Object.entries(nameOrObj).forEach(([name, value]) => {
      if (!source[name] === undefined) throw new Error(`'${name}' isn't defined yet`);
      source[name] = value;
    });
  } else {
    if (!source[nameOrObj] === undefined) throw new Error(`'${nameOrObj}' isn't defined yet`);
    source[nameOrObj] = value;
  }
}

(() => {
  const methods = {
    on: function(proxy, event, callback) {
      this.addEventListener(event, callback);
      return proxy;
    },
    once: function(proxy, event, callback) {
      this.addEventListener(event, function(e) {
        this.removeEventListener(event, arguments.callee);
        callback(e);
      });
      return proxy;
    },
    hasClass: function(_, className) {
      return this.classList.contains(className);
    },
    toggleClass: function(proxy, className) {
      this.classList.toggle(className);
      return proxy;
    },
    addClass: function(proxy, className) {
      this.classList.add(className);
      return proxy;
    },
    removeClass: function(proxy, className) {
      this.classList.remove(className);
      return proxy;
    },
    append: function(proxy, ...childs) {
      for (const child of childs) {
        this.appendChild(child.element || child);
      }
      return proxy;
    },
    setText: function(proxy, text) {
      this.innerText = text;
      return proxy;
    },
    set: function(proxy, attribute, value) {
      this.setAttribute(attribute, value);
      return proxy;
    },
    child: function(_, index) {
      const child = this.children[index];
      return child ? wrap(child) : child;
    },
    delete: function() {
      const parent = this.parentElement;
      if (parent) parent.removeChild(this);
    }
  }

  function wrap(element) {
    const proxy = new Proxy(element, {
      get(target, propKey, proxy) {
        if (propKey in methods) {
          const prop = methods[propKey];

          if (typeof prop === 'function') {
            return function(...args) {
              return prop.apply(target, [proxy, ...args]);
            }
          } else {
            return prop;
          }
        } else {
          const prop = target[propKey]

          if (typeof prop === 'function') {
            return function(...args) {
              return prop.apply(target, args);
            }
          } else {
            return prop;
          }
        }
      },
      set(target, propKey, value) {
        target[propKey] = value;
      }
    });
    proxy.element = element;
    return proxy;
  }

  const $ = function(tag, attributes = {}) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return wrap(element);
  }
  $.id = function(id) {
    return wrap(document.getElementById(id));
  }
  $.tag = function(tag) {
    return [...document.getElementsByTagName(tag)].map(wrap);
  }
  $.class = function(className) {
    return [...document.getElementsByClassName(className)].map(wrap);
  }
  $.wrap = function(element) {
    return wrap(element);
  }
  source({ $ });

  source('request', (method, url, body = null, json = true) => {
    return new Promise((res, rej) => {
      const xhttp = new XMLHttpRequest();

      xhttp.addEventListener('load', () => {
        const response = json ? JSON.parse(xhttp.response) : xhttp.response;

        if (xhttp.status === 200) res(response);
        else rej(response);
      });

      xhttp.open(method.toUpperCase(), url, true);
      xhttp.send(body);
    });
  });

  source('require', async path => {
    const file = await source.request('get', path, null, false);

    const script = document.createElement('script');
    script.setAttribute('path', path);
    script.innerHTML = file;

    document.head.appendChild(script);
  });

  source('shortcut', (combination, callback) => {
    let fired = false;

    document.addEventListener('keydown', function(event) {
      if (
        fired ||
        event.code.startsWith('Shift') ||
        event.code.startsWith('Control') ||
        !combination(event)
      ) return;
      fired = true;

      event.stopImmediatePropagation();
      callback(event);
    });

    document.addEventListener('keyup', () => fired = false);
  });
})();
