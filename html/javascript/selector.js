function Selector(title, content, callback) {
  this.show = () => {
    selector.setAttribute('style', 'display:inherit');
    fill();
    return search.focus();
  };

  this.hide = () => {
    selector.setAttribute('style', 'display:none');
    return bin.focus();
  };

  const fill = () => {
    options.innerHTML = '';
    const items = content.filter(i => i.toLowerCase().includes(search.value.toLowerCase()));
    return items.forEach(i => {
      const item = document.createElement('div');
      item.setAttribute('class', 'box');
      item.innerHTML = i;
      item.addEventListener('click', callback.bind(this));
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
  search.addEventListener('input', fill);
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
}

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
    display: none;
    background-color: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .selector .container {
    background-color: var(--background);
    width: 70vw;
    height: 70vh;
    margin: 15vh 15vw;
    border: var(--border);
    color: var(--color);
    user-select: none;
    cursor: default;
  }

  .selector .container button {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    float: right;
    cursor: pointer;
    background-color: var(--color);
    height: 3.5vh;
    width: 4vw;
    transition-duration: 0.15s;
  }

  .selector .container button:hover {
    background-color: #f44336;
    color: var(--color);
  }

  .selector .container .head {
    height: 40px;
    line-height: 40px;
    display: block;
    font-family: 'Raleway:Bold', sans-serif;
    font-size: 30px;
    padding: 20px 50px;
    border-bottom: var(--border);
  }

  .selector .container .head input {
    margin: 13px 50px;
    float: right;
    outline: none;
    border: none;
    border-bottom: 1px solid var(--color);
    color: var(--color);
    background: transparent;
  }

  .selector .container .options {
    height: calc(70vh - 80px);
    overflow-y: auto;
  }

  .selector .container .options .box {
    font-family: 'Raleway', sans-serif;
    font-size: 20px;
    padding: 10px 50px;
    border-bottom: var(--border);
    cursor: pointer;
  }`;
  document.head.appendChild(style);
})();
