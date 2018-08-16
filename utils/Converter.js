class Converter {
  constructor(variables = {}) {
    this.variables = variables;
  }

  convert(text, variables = {}) {
    const regex = /<% ([\\a-zA-Z0-9]+?)(=(.+?))? %>/;
    const matches = this._removeDupes(text.match(new RegExp(regex, 'g')) || []);
    for (let match of matches) {
      match = regex.exec(match);
      let replacement = variables[match[1]];
      if (!replacement) replacement = match[3];
      if (!replacement) replacement = this.variables[match[1]];
      const string = new RegExp(match[0], 'g');
      text = text.replace(match[0], replacement);
    }
    return text;
  }

  _removeDupes(array) {
    return [...new Set(array)];
  }
}
module.exports = Converter;
