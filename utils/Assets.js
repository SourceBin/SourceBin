const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-es');
const cleanCSS = new CleanCSS({ returnPromise: true });

const fs = require('fs');
const path = require('path');
const readFile = require('util').promisify(fs.readFile);

class Assets {
  /**
   * Create a new Assets instance
   * @param {String} dir The root dir of the assets
   * @param {Boolean} [minify=true] Whether to minify the assets
   */
  constructor(dir, minify = true) {
    this.minify = minify;

    this.paths = Assets.loadPaths(dir);
    this.files = new Map();
  }

  /**
   * Get an assets file by path
   * @param {String} filePath The path to the file
   * @returns {?String}
   */
  async get(filePath) {
    if (!this.paths.has(filePath)) {
      return null;
    }

    let file = this.files.get(filePath);
    if (!file) {
      file = await Assets.loadAsset(filePath, this.minify);
      this.files.set(filePath, file);
    }

    return file;
  }

  /**
   * Load all paths from an assets folder
   * @param {String} dir The dir to load from
   * @returns {Set<String>}
   */
  static loadPaths(dir) {
    let paths = new Set();

    for (const file of fs.readdirSync(dir)) {
      const location = path.join(dir, file);
      const isDir = fs.lstatSync(location).isDirectory();

      if (isDir) {
        // Load dir recursivly
        Assets.loadPaths(location)
          .forEach(x => paths.add(x));
      } else {
        paths.add(location);
      }
    }

    return paths;
  }

  /**
   * Load an assets file
   * @param {String} filePath The path to the file
   * @param {Boolean} [minify=true] Whether to minify the asset
   * @returns {String}
   */
  static async loadAsset(filePath, minify = true) {
    let file = (await readFile(filePath)).toString();

    switch (filePath.match(/^.+\.(.+)$/)[1]) {
      case 'js':
        file = await Assets.addCSS(file, filePath, minify);
        if (minify) file = Assets.minifyJS(file);
        break;
      case 'css':
        if (minify) file = await Assets.minifyCSS(file);
        break;
    }

    return file;
  }

  /**
   * Add CSS to a JavaScript file when needed
   * @param {String} js The JavaScript file
   * @param {String} path The path to the JavaScript file
   * @param {Boolean} [minify=true] Whether to minify the CSS
   * @returns {String}
   */
  static async addCSS(js, filePath, minify = true) {
    const match = js.match(/^\/\/ CSS: (.+)$/m);

    if (match) {
      let css = (await readFile(
        path.join(filePath, '../', match[1])
      )).toString();

      if (minify) css = await Assets.minifyCSS(css);

      js += `
        (() => {
          const style = document.createElement('style');
          style.innerHTML = \`${css}\`;
          document.head.appendChild(style);
        })();`;
    }

    return js;
  }

  /**
   * Minify JavaScript
   * @param {String} js The JavaScript to minify
   * @returns {String}
   */
  static minifyJS(js) {
    return UglifyJS.minify(js).code;
  }

  /**
   * Minify CSS
   * @param {String} css The CSS to minify
   * @returns {String}
   */
  static async minifyCSS(css) {
    return (await cleanCSS.minify(css)).styles;
  }
}
module.exports = Assets;
