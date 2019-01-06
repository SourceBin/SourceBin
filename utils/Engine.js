const crypto = require('crypto');
// eslint-disable-next-line
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

class Engine {
  /**
   * Create a new engine object with a set of options
   * @param {Object} [options={}] The options for the engine
   * @param {Boolean} [options.cache=true] Whether to cache the compiled function
   * @param {Number} [options.cacheInterval=0] The delay between clearing the cache
   * if cache is enabled, if 0 or less cache will never clear
   * @param {Object} [options.flags={}] Custom flags for the engine
   */
  constructor(options = {}) {
    options = {
      ...{
        cache: true,
        cacheInterval: 0,
        flags: {},
      },
      ...options,
    };

    this.flags = {
      ...{
        '#': append => {
          append();
        },
        '=': (append, code) => {
          append(code, function escapeHtml(str) { // eslint-disable-line
            return String(str)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
          });
        },
        '-': (append, code) => {
          append(code);
        },
      },
      ...options.flags,
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
   * @param {Object} [options={}] Options for the compiler
   * @param {Boolean} [options.async] Whether the function should be async
   * @param {Boolean} [options.debug] Whether to enable debug mode to provide useful information on errors
   *
   * @returns {String} The rendered HTML
   */
  render(input, variables, options = {}) {
    return this.compile(input, Object.keys(variables), options)(...Object.values(variables));
  }

  /**
   * Compile HTML into an executable function
   * @param {String} input The HTML to compile
   * @param {Array} [variableNames] The names of the variables that should be passed to the function
   * @param {Object} [options={}] Options for the compiler
   * @param {Boolean} [options.async] Whether the function should be async
   * @param {Boolean} [options.debug] Whether to enable debug mode to provide useful information on errors
   *
   * @returns {Function} The compiled function
   */
  compile(input, variableNames, options = {}) {
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
    while ((match = regex.exec(input))) { // eslint-disable-line no-extra-parens
      let [full, flag, code] = match;

      // Append regular text
      append(input.slice(cursor, match.index), true);
      cursor = match.index + full.length;

      if (options.debug) output += `__line__ = ${input.substr(0, cursor).split('\n').length};`;

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
        output += `${code}\n`;
      }
    }

    // Add remaining text
    append(input.slice(cursor), true);

    // Finish up the code and create a function
    output += `return ${array}.join("");`;

    if (options.debug) {
      output = `
        let __line__ = 1;
        let __lines__ = \`${input.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
        try{
          ${output}
        } catch(e) {
          console.error(\`Error on line \${__line__} | \${__lines__.split(/\\r?\\n/)[__line__-1]}\\n\${e.stack}\`);
        }`;
    }

    // eslint-disable-next-line space-unary-ops
    const func = new(options.async ? AsyncFunction : Function)(variableNames || '', output).bind(functions);

    // Add the function to cache and return it
    if (this.cache) this.cache.set(hash, func);
    return func;
  }
}
module.exports = Engine;
