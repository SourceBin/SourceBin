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
