// CSS: ../css/popup.css

/* global source */
source('popup', function(text) {
  const $ = source.$;
  const $popup = $('div').addClass('popup').setText(text).on('click', () => this.delete());
  $.wrap(document.body).append($popup);

  this.delete = () => $popup.delete();

  setTimeout(this.delete, 1000 * 10);
});
