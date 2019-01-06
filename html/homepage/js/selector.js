// css: ../css/selector.css
source('selector', function(title, content, onSelect) {
  const $ = source.$;

  const $content = $('div');
  const $input = $('input', { type: 'text', placeholder: 'Search' });
  const $selector = $('div').addClass('selector').append(
    $('div').addClass('container').append(
      $('a').on('click', () => this.close()),
      $('div').addClass('title').append(
        $('h1').setText(title),
        $input.on('input', () => this.fill())
      ),
      $content.addClass('content')
    )
  ).set('style', 'display:none').on('click', e => {
    if (e.target === $selector.element) this.close();
  });
  $.wrap(document.body).append($selector);

  let callback;
  let isOpen = false;
  this.open = onSelect => {
    $selector.set('style', 'display:inherit');

    callback = onSelect;
    this.fill();

    $input.focus();
    isOpen = true;
  }

  this.close = () => {
    $selector.set('style', 'display:none');
    source.editor.focus();
    isOpen = false;
  }

  let index = 0;
  this.fill = () => {
    $content.innerHTML = '';
    $content.append(
      ...content
      .filter(i => i.toLowerCase().includes($input.value.toLowerCase()))
      .map(i => $('p').setText(i).on('click', async e => {
        await onSelect.bind(this)(e);
        if (callback) {
          callback.bind(this)(e);
          callback = null;
        }
        this.close();
      }))
    );

    index = 0;
    const $i = $content.child(index);
    if ($i) $i.addClass('hover');
  }

  source.shortcut(e => isOpen && e.key === 'ArrowUp', e => {
    if (index <= 0) return;

    $content.child(index).removeClass('hover');
    index--;
    $content.child(index).addClass('hover').scrollIntoView({ block: 'center' });
    e.preventDefault();
  });

  source.shortcut(e => isOpen && e.key === 'ArrowDown', e => {
    if (index + 1 >= $content.children.length) return;

    $content.child(index).removeClass('hover');
    index++;
    $content.child(index).addClass('hover').scrollIntoView({ block: 'center' });
    e.preventDefault();
  });

  source.shortcut(e => isOpen && e.key === 'Enter', e => {
    const el = $content.child(index);
    if (el) el.click();
    e.preventDefault();
  });

  source.shortcut(e => isOpen && e.key === 'Escape', e => {
    this.close();
    e.preventDefault();
  });
});
