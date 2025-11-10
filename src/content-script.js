// Source: https://www.legislation.gov.uk/uksi/2016/507/schedule/A1
const coa = 'Commonwealth of Australia';
const ljw = 'Professor Laurence J Walsh, The University of Queensland';
const messages = [
  [ coa, 'Smoking clogs', 'your arteries'],
  [ coa, 'Don\'t let children', 'breathe your smoke'],
  [ coa, 'Smoking causes', 'blindness'],
  [ coa, 'Smoking causes', 'lung cancer'],
  [ coa, 'Smoking doubles', 'your risk of stroke'],
  [ coa, 'Tobacco smoke is toxic'],
  [ coa, 'Smoking harms', 'unborn babies'],
  [ coa, 'Smoking causes', 'peripheral vascular disease'],
  [ coa, 'Smoking causes', 'emphysema'],
  [ coa, 'Quitting will', 'improve', 'your health'],
  [ ljw, 'Smoking damages', 'your gums and teeth'],
  [ ljw, 'Smoking damages', 'your gums and teeth'],
  [ coa, 'Smoking causes', 'throat cancer'],
];

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ---------------------------------------------------------- //
function init() {
  console.log('hi from init()');
  try {
    _init();
  } catch(err) {
    console.error('Error caught loading content script:', err);
  }
}

function _init() {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode:'open' });
  const $hud = document.createElement('div');

  $hud.style.cssText = css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50vh;
    z-index: 2147483647;
    background-color: black;
    color: white;
    padding: 10px;
    font-family: Inter,Helvetica,Arial,sans-serif;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding 10px;
  `;

  const idx = Math.floor(Math.random()*messages.length);
  const [ copyright, ...messageParts ] = messages[idx];

  const $contentWrapper = createElement('div', css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `);

  const $imgContainer = createElement('div', css`
    flex: 1;
    justify-content: center;
    align-items: center;
  `);
  const imgSrc = chrome.runtime.getURL(`images/${idx+1}.gif`);
  const $img = createElement('img', { src:imgSrc, title:`© ${copyright}` }, css`
    max-height: 25vh; 
  `);
  $imgContainer.appendChild($img);
  // FIXME add image copyrights, perhaps per https://stackoverflow.com/questions/21483356/how-to-mark-the-copyright-of-an-image-in-html
  $contentWrapper.appendChild($imgContainer);

  const $msgContainer = createElement('div', css`
    flex: 1;
    height: 50%;
    width: 100%; /* Match image width */
    max-width: max-content; /* Adjust to image's actual width */
    display: flex;
    align-items: center;
    line-height: 1.2;
  `);
  const longestLine = messageParts.reduce((max, curr) => Math.max(max, curr.length), 0);
  const fontSize = messageParts.length === 2 ? 9 : 6;
  const $msg = createElement('p', css`
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-width: 100%;

    white-space: nowrap;
    font-size: min(calc(1.5/${longestLine} * 100vw), ${fontSize}vh);
  `);
  for(let i=0; i<messageParts.length; ++i) {
    if(i) $msg.appendChild(createElement('br'));
    $msg.append(messageParts[i]);
  }
  $msgContainer.appendChild($msg);
  $contentWrapper.appendChild($msgContainer);

  $hud.appendChild($contentWrapper);

  document.body.style.paddingBottom = '50vh';
  shadowRoot.appendChild($hud);
}

function css([first, ...rest], ...values) {
  const builder = [ first ];
  for(let i=0; i<values.length; ++i) {
    builder.push(values[i].toString());
    builder.push(rest[i]);
  }
  return builder.join('');
}

function createElement(tag, props, css) {
  if(css === undefined && typeof props === 'string') {
    css = props;
    props = undefined;
  }
  const $el = document.createElement(tag);
  if(props) for(const [k,v] of Object.entries(props)) $el[k] = v;
  if(css) $el.style.cssText = css;
  return $el;
}
