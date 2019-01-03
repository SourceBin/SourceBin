source('popup', function(text) {
  const $ = source.$;
  $popup = $('div').addClass('popup').setText(text).on('click', () => this.delete());
  $.wrap(document.body).append($popup);

  this.delete = () => $popup.delete();

  setTimeout(this.delete, 1000 * 10);
});

(() => {
  const style = document.createElement('style');
  style.innerHTML = `.popup {
    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 100;
    width: auto;
    height: auto;
    max-width: 500px;
    padding: 10px 15px;
    border-radius: 5px;
    color: rgba(255, 255, 255, .9);
    background-color: #424242;
    user-select: none;
    cursor: pointer;
    font-family: 'Raleway', sans-serif;
    font-weight: 500;
  }`;
  document.head.appendChild(style);
})();
