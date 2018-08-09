function Selector(title, content, callback) {
  this.show = () => {
    this.selector.setAttribute('style', 'display:inherit');
    this.fill();
    return this.search.focus();
  };

  this.hide = () => {
    this.selector.setAttribute('style', 'display:none');
    return bin.focus();
  };

  this.fill = () => {
    options.innerHTML = '';
    const items = content.filter(i => i.toLowerCase().includes(search.value.toLowerCase()));
    return items.forEach(i => {
      const item = document.createElement('div');
      item.setAttribute('class', 'box');
      item.innerHTML = i;
      item.addEventListener('click', callback);
      options.appendChild(item);
    });
  };

  const selector = document.createElement('div');
  selector.addEventListener('click', event => {
    if (event.target === selector) return this.hide();
  });
  selector.setAttribute('class', 'selector');

  const container = document.createElement('div');
  container.setAttribute('class', 'container');

  const closeButton = document.createElement('button');
  closeButton.addEventListener('click', this.hide);
  closeButton.setAttribute('class', 'closebutton');
  closeButton.innerHTML = 'X';

  const head = document.createElement('div');
  head.setAttribute('class', 'head');
  head.innerHTML = title;

  const search = document.createElement('input');
  search.addEventListener('input', this.fill);
  search.setAttribute('class', 'search');
  search.setAttribute('type', 'text');
  search.setAttribute('placeholder', 'Search');

  const options = document.createElement('div');
  options.setAttribute('class', 'options');

  head.appendChild(search);
  container.appendChild(closeButton);
  container.appendChild(head);
  container.appendChild(options);
  selector.appendChild(container);
  document.body.appendChild(selector);

  this.selector = selector;
  this.search = search;
}
