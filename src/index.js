import './styles.css';

function component () {
  const element = document.createElement('div');
  element.classList.add('text');
  element.innerHTML = ['hello', 'world'].join(' ');
  return element;
}

document.body.appendChild(component());
