import './ui.css';

import { json, css, scss, android } from './template';

let currentCode;
let currentColor;

const buttons = document.querySelectorAll('#code button');
const options = <HTMLSelectElement>document.getElementById('options');
const output: HTMLInputElement =<HTMLInputElement>document.getElementById('output');
const copy = document.getElementById('copy');
const activeClass = 'active';

const postFormat = (code, color) => {
  parent.postMessage({ pluginMessage: { 
    type: 'collect-tokens',
    storage: {
      code: code,
      color: color
    }
  } }, '*');
}

copy.addEventListener('click', (e) => {
  const label = copy.textContent;

  output.select();
  document.execCommand('copy');

  copy.textContent = 'Copied!';
  copy.style.fontWeight = 'bold';
  
  setTimeout(function() {
    copy.textContent = label;
    copy.style.fontWeight = '';
  }, 1500)
})

parent.postMessage({ pluginMessage: { type: 'collect-tokens' } }, '*');

onmessage = message => {
  if (message.data.pluginMessage.type == "collect-tokens") {
    // TODO: 値変更の保持
    // TODO: prefix, suffixの付与
    // TODO: カスタムテンプレート

    // データを受け取る
    const data = message.data.pluginMessage.data;
    const storage = message.data.pluginMessage.storage;

    // storageにデータがあれば、そのデータを格納する
    if(storage !== undefined && storage.code !== undefined || storage.color !== undefined) {
      currentCode = storage.code;
      currentColor = storage.color;
    } else {
      currentCode = 'json';
      currentColor = 'default';
    }

    // データに応じて、表示するコードを切り替える
    const switchFormat = (code, color) => {
      switch (code) {
        case 'json':
          output.value = json(data)
          break;
        case 'css': 
          output.value = css(data, color)
          break;
        case 'scss':
          output.value = scss(data, color)
          break;
        case 'android':
          output.value = android(data, color)
          break;
        default:
          output.value = json(data)
      }
      
      switchCode(currentCode);
      switchColor(currentColor);
      postFormat(code, color);
    }

    // データに応じて、表示するタブを切り替える
    const switchCode = (code) => {
      const current = Array.from(buttons).find(button => button.classList.contains(activeClass));
      const selected = Array.from(buttons).find((button: HTMLButtonElement) => button.dataset.code === code);

      if(code === "json" || code === "android") {
        options.disabled = true;
      } else {
        options.disabled = false;
      }

      current.classList.remove(activeClass);
      selected.classList.add(activeClass);
    }

    // データに応じて、表示するタブを切り替える
    const switchColor = (color) => {
      options.value = color
    }

    // コードを選ぶと現在値を変更する
    const changeButton = (e) => {
      const selected = e.target;

      currentCode = selected.dataset.code;

      switchFormat(currentCode, currentColor);
    }

    // console.log(storage)
    
    buttons.forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', changeButton);
    })

    // TODO: データに応じてselect切り替え！！！
    options.addEventListener('change', (e) => {
      currentColor = (<HTMLInputElement>e.target).value;

      switchFormat(currentCode, currentColor);
    })

    // init
    switchFormat(currentCode, currentColor);
  }
};