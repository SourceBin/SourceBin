function Popup(text, textColor, backgroundColor, hideOnClick, duration) {
  this.show = () => {
    return popup.style.display = 'block';
  };

  this.hide = () => {
    return popup.style.display = 'none';
  };

  this.remove = () => {
    return popup.parentElement.removeChild(popup);
  };

  const popup = document.createElement('div');
  popup.setAttribute('class', 'popup');
  popup.setAttribute('style', `background-color: ${backgroundColor}; color: ${textColor}`);
  popup.innerHTML = text;
  if (hideOnClick) popup.addEventListener('click', this.hide);
  document.body.appendChild(popup);
  this.show();
  if (duration) setTimeout(this.remove, duration);
}

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
    color: #23272A;
    background-color: #FF5050;
    user-select: none;
    cursor: pointer;
    font-family: Arial, sans-serif;
  }`;
  document.head.appendChild(style);
})();
