const crypto = require('crypto');
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

class Engine {

  /**
   * Create a new engine object with a set of options
   * @param {Object} [options={}] The options for the engine
   * @param {Boolean} [options.cache=true] Whether to cache the compiled function
   * @param {Number} [options.cacheInterval=0] The delay between clearing the cache if cache is enabled, if 0 or less cache will never clear
   * @param {Object} [options.flags={}] Custom flags for the engine
   */
  constructor(options = {}) {
    options = {
      ...{
        cache: true,
        cacheInterval: 0,
        flags: {}
      },
      ...options
    };

    this.flags = {
      ...{
        '#': (append) => {
          append();
        },
        '=': (append, code) => {
          append(code, function escapeHtml(str) {
            return str
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
          });
        },
        '-': (append, code) => {
          append(code);
        },
        '_': (append, code) => {
          append(code, function trim(str) {
            return str.trim();
          });
        }
      },
      ...options.flags
    };

    if (options.cache) {
      this.cache = new Map();
      if (options.cacheInterval > 0) {
        setInterval(() => this.cache.clear(), options.cacheInterval);
      }
    }
  }

  /**
   * Render a HTML string
   * @param {String} input The HTML to render
   * @param {Object} [variables] The variables to pass to the function to be used inside the HTML
   * @param {Boolean} [async=false] Whether to use an async function to allow async/await
   * @returns {String} The rendered HTML
   */
  render(input, variables, async = false) {
    return this.compile(input, Object.keys(variables), async)(...Object.values(variables));
  }

  /**
   * Compile HTML into an executable function
   * @param {String} input The HTML to compile
   * @param {Array} [variableNames] The names of the variables that should be passed to the function
   * @param {Boolean} [async=false] Whether to use an async function to allow async/await
   * @returns {Function} The compiled function
   */
  compile(input, variableNames, async = false) {
    let hash;
    if (this.cache) {
      hash = crypto.createHash('sha1').update(input).digest('base64');
      if (this.cache.has(hash)) return this.cache.get(hash);
    }

    const regex = /<%(.)? (.+?) %>/gs;
    const array = '__output__array__';
    const functions = {};
    let output = `const ${array} = [];`;
    let cursor = 0;

    function append(text, string = false) {
      if (string) {
        output += `${array}.push(\`${
                    text.replace(/`/g, '\\`').replace(/\$/g, '\\$')
                    }\`);`;
      } else {
        output += `${array}.push(${text});`;
      }
    }

    let match;
    while ((match = regex.exec(input))) {
      let [full, flag, code] = match;

      // Append regular text
      append(input.slice(cursor, match.index), true);
      cursor = match.index + full.length;

      // Check for a flag
      if (flag) {
        code = code.replace(/; *$/, '');
        if (flag in this.flags) {
          // Execute the flag callback
          this.flags[flag]((code, callback) => {
            if (code && callback) {
              const name = `__${callback.name || flag.charCodeAt(0)}__`;
              functions[name] = callback;
              append(`this.${name}(${code})`);
            } else if (code) {
              append(code);
            }
          }, code);
        } else {
          // Throw an error when an unknown flag is being used
          throw new TypeError(`Unexpected flag ${flag}`);
        }
      } else {
        // Append JavaScript code
        output += code + '\n';
      }
    }

    // Add remaining text
    append(input.slice(cursor), true);

    // Finish up the code and create a function
    output += `return ${array}.join("");`;
    const func = new(async ?AsyncFunction: Function)(variableNames || '', output).bind(functions);

    // Add the function to cache and return it
    if (this.cache) this.cache.set(hash, func);
    return func;
  }
}
module.exports = Engine;
