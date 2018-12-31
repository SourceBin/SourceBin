function Bin(options) {
  const disabled = new Set();
  this.isDisabled = name => disabled.has(name);

  let key = options.key;
  let language = options.language;

  const editor = ace.edit('editor');
  editor.setFontSize(15);
  if (editor.getValue() === 'Loading...') {
    editor.setValue('', -1);
  }
  this.LinkBox = new LinkBox(this);

  this.focus = () => editor.focus();

  function getURL() {
    let url = window.location.origin;
    if (key) {
      url += '/' + key;
      if (language) url += language.extension;
    }
    return url;
  }

  this.setURL = () => {
    const url = getURL();
    this.LinkBox.set(url);
    return window.history.replaceState(null, null, url);
  };

  this.setLanguage = lang => {
    if (lang) language = lang;
    if (!language) return;
    document.getElementById('lang').innerHTML = `Language - ${language.name}`;
    return editor.session.setMode(`ace/mode/${language.ace_mode}`);
  };

  this.setTheme = (theme = {}) => {
    if (!theme.ace || !theme.name) theme = JSON.parse(localStorage.getItem('theme')) || {};
    if (!theme.ace || !theme.name) theme = { ace: 'material', name: 'Material' };
    localStorage.setItem('theme', JSON.stringify(theme));
    document.getElementById('theme').innerHTML = `Theme - ${theme.name}`;
    return editor.setTheme(`ace/theme/${theme.ace}`);
  };

  this.save = () => {
    if (this.isDisabled('Save')) {
      return new Popup('You can not re-save already saved bins!', null, null, true, 10000);
    }

    return _request('post', '/bin', editor.getValue())
      .then(response => {
        if (response) key = response.key;

        this.setURL();
        this.disableSave();

        function manualCopy() {
          this.LinkBox.show();
          if (!language) languageSelector.show();
        }

        navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
          if (result.state == 'granted' || result.state === 'prompt') {
            navigator.clipboard.writeText(getURL()).then(() => {
              new Popup('URL copied to clipboard', '#FFF', '#22dc22', true, 10000);
            }, () => {
              manualCopy();
            });
          } else {
            manualCopy();
          }
        });
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
  textarea.addEventListener('click', () => textarea.select());
  this.set = string => textarea.innerHTML = string;
  this.show = () => box.setAttribute('style', 'display:inherit');
  this.hide = () => {
    box.setAttribute('style', 'display:none');
    return bin.focus();
  };
}
