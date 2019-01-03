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
  ).set('style', 'display:none');
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

(() => {
  const style = document.createElement('style');
  style.innerHTML = `.selector {
    z-index: 10;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.1);

    font-family: 'Raleway', sans-serif;
  }

  .selector .container {
    float: right;
    width: 600px;
    height: calc(100vh - var(--nav-size));
    margin-top: var(--nav-size);

    background-color: #2c2f33;
    color: rgba(255, 255, 255, .9);

    border-left: 1px solid #23272a;
  }

  .selector .container a {
    position: absolute;
    right: 0;

    width: 50px;
    height: 25px;

    cursor: pointer;
    background-color: #f44336;
    font-weight: 500;
    font-size: 20px;
    line-height: 25px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .selector .container a::before {
    content: 'x';
  }

  .selector .container .title {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #23272a;
  }

  .selector .container .title h1 {
    margin: 0 20px;
    font-size: 30px;
    font-weight: 700;
  }

  .selector .container .title input {
    margin: 0 20px;
    padding: 8px 2px 2px;

    outline: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, .9);

    color: rgba(255, 255, 255, .9);
    background: transparent;
  }

  .selector .container .content {
    width: 100%;
    height: calc(100vh - var(--nav-size) - 50px);
    overflow-y: auto;
  }

  .selector .container .content p {
    border-bottom: 1px solid #23272a;
    font-size: 20px;

    display: block;
    margin: 0;
    padding: 10px 25px;

    cursor: pointer;
    user-select: none;
  }

  .selector .container .content p.hover {
    background-color: #5c626a;
  }`;
  document.head.appendChild(style);
})();
