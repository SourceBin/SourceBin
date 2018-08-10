function Bin(options) {
  const disabled = new Set();
  this.isDisabled = name => disabled.has(name);

  let key = options.key;
  let language = options.language;
  const readOnly = options.readOnly;

  const editor = ace.edit('editor');
  editor.setTheme('ace/theme/material');
  editor.setReadOnly(readOnly);
  editor.setFontSize(15);
  if (editor.getValue() === 'Loading...') editor.setValue('', -1);
  this.LinkBox = new LinkBox(this);

  this.focus = () => editor.focus();
  this.setReadOnly = boolean => editor.setReadOnly(boolean);
  this.setURL = () => {
    let url = window.location.origin;
    if (key) {
      url += '/' + key;
      if (language) url += '.' + language.extension;
    }
    return window.history.pushState(null, null, url);
  };
  this.setLanguage = lang => {
    if (lang) language = lang;
    if (!language) return;
    document.getElementById('lang').innerHTML = `Language - ${language.name}`;
    return editor.session.setMode(`ace/mode/${language.ace}`);
  };
  this.setTheme = (theme = {}) => {
    if (!theme.ace || !theme.name) theme = { ace: localStorage.getItem('theme-ace'), name: localStorage.getItem('theme-name') };
    if (!theme.ace || !theme.name) theme = { ace: 'material', name: 'Material' };
    localStorage.setItem('theme-ace', theme.ace);
    localStorage.setItem('theme-name', theme.name);
    document.getElementById('theme').innerHTML = `Theme - ${theme.name}`;
    return editor.setTheme(`ace/theme/${theme.ace}`);
  };
  this.save = () => {
    if (this.isDisabled('Save')) return;
    this.disableSave();
    editor.setReadOnly(true);
    LanguageSelector.show(); // TODO: Display linkbox after select
    return _request('post', '/', editor.getValue())
      .then(response => {
        if (response) key = response.key;
        return this.setURL();
      });
  };
  this.disableSave = () => {
    const save = document.getElementById('save');
    const className = save.className;
    save.className += className.includes('disabled') ? '' : ' disabled';
    return disabled.add('Save');
  };

  this.setURL();
  this.setLanguage();
  this.setTheme();
  if (!options.allowSave) this.disableSave();
}

function LinkBox(bin) {
  const box = document.getElementById('linkbox');
  const textarea = document.getElementById('link');
  this.set = string => textarea.innerHTML = string;
  this.show = () => {
    this.set(window.location.href);
    box.setAttribute('style', 'display:inherit');
    return setTimeout(() => textarea.select(), 100);
  };
  this.hide = () => {
    box.setAttribute('style', 'display:none');
    return bin.focus();
  };
}
