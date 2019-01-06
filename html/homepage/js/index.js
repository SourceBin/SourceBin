(() => {
  source('setTheme', (theme = {}) => {
    if (!theme.ace || !theme.name) theme = JSON.parse(localStorage.getItem('theme')) || {};
    if (!theme.ace || !theme.name) theme = { ace: 'material', name: 'Material' };

    localStorage.setItem('theme', JSON.stringify(theme));
    source.$.id('theme').innerHTML = `Theme - ${theme.name}`;

    source.editor.setTheme(`ace/theme/${theme.ace}`);
  });

  source('setMode', language => {
    if (language) source.update({ language });
    else {
      language = source.language;
      if (!language) return;
    }

    source.$.id('language').innerHTML = `Language - ${language.name}`;
    source.editor.session.setMode(`ace/mode/${language.ace_mode}`);
    source.setUrl();
  });

  source('setUrl', () => {
    const key = source.key;
    const language = source.language;
    let url = window.location.origin;
    if (key) {
      url += '/' + key;
      if (language && language.extension) url += language.extension;
    }

    window.history.replaceState(null, null, url);
    return url;
  });

  source('save', async () => {
    let response;
    try {
      response = await source.request('post', '/bin', source.editor.getValue());
    } catch (e) {
      source.popup(e.error);
      source.$.id('save').removeClass('disabled');
    }

    if (!response) return;
    source.update('key', response.key);

    async function save() {
      const url = source.setUrl();
      const result = await navigator.permissions.query({ name: 'clipboard-write' })
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(url).then(() => {
          source.popup('Copied Link to Clipboard');
        }, () => {
          source.popup('Saved the bin, you can copy the link now');
        });
      } else {
        source.popup('Saved the bin, you can copy the link now');
      }
    }

    if (source.settings.rememberLanguage) save();
    else source.languageSelector.open(() => save());
  });

  source('updateSettings', (settings = {}) => {
    settings = {
      fontSize: 15,
      printMargin: true,
      rememberLanguage: true,

      ...JSON.parse(localStorage.getItem('settings') || '{}'),
      ...settings
    };
    localStorage.setItem('settings', JSON.stringify(settings));

    source.editor.setFontSize(settings.fontSize);
    source.editor.setShowPrintMargin(settings.printMargin);
  });
})();

(async () => {
  await source.require('./assets/editor/ace.js');
  await source.require('./assets/homepage/js/selector.js');
  source.require('./assets/homepage/js/popup.js');

  ace.config.set('basePath', '/assets/editor');
  ace.config.set('modePath', '/assets/editor');
  ace.config.set('themePath', '/assets/editor');

  const editor = ace.edit('editor');
  source({ editor });

  source.updateSettings();
  source.setTheme();
  source.setMode();

  editor.container.style.display = 'inherit';
  editor.focus();

  const $ = source.$;
  const $save = $.id('save');
  $save.on('click', () => {
    if ($save.hasClass('disabled')) return;

    $save.addClass('disabled');
    source.save();
  });

  source.shortcut(e => e.key === 's' && e.ctrlKey, e => {
    $save.click();
    e.preventDefault();
  });

  if (source.key) {
    editor.session.on('change', function() {
      editor.session.off('change', arguments.callee);

      $save.removeClass('disabled');
      source.update('key', null);
      source.setUrl();
    });
  }

  $.id('new').on('click', () => {
    editor.setValue('');
    $save.removeClass('disabled');
    source.update('key', null);
    source.setUrl();
    editor.focus();
  });

  const languageSelector = new source.selector('Language', source.languages, async e => {
    const language = e.target.innerHTML;
    const response = await source.request('get', `/language?search=${encodeURIComponent(language)}`);
    if (!response) return;

    localStorage.setItem('language', JSON.stringify(response));
    source.setMode(response);
  });
  const themeSelector = new source.selector('Theme', source.themes, async e => {
    const theme = e.target.innerHTML;
    const response = await source.request('get', `/theme?search=${encodeURIComponent(theme)}`);
    if (!response) return;

    source.setTheme(response);
  });
  source({ languageSelector, themeSelector });

  $.id('language').on('click', () => {
    languageSelector.open();
  });

  $.id('theme').on('click', () => {
    themeSelector.open();
  });

  $.id('profile').on('click', () => {
    // TODO: Open profile page on this page
    window.open('/profile', '_self');
  });
})();
