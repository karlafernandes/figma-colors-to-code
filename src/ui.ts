import './ui.css';

import { json, css, scss } from './template';

parent.postMessage({ pluginMessage: { type: 'collect-tokens' } }, '*');

onmessage = message => {
  if (message.data.pluginMessage.type == "collect-tokens") {
    // TODO: RGB, HSLへの変換
    // TODO: prefix, suffixの付与
    // TODO: カスタムテンプレート

    const buttons = document.querySelectorAll('#format button');
    const options = <HTMLSelectElement>document.getElementById('options');

    const output: HTMLInputElement =<HTMLInputElement>document.getElementById('output');
    const copy = document.getElementById('copy');

    const data = message.data.pluginMessage.data;

    // let color = (<HTMLInputElement>options).value;
    let currentFormat = 'json';
    let currentColor = 'default';

    console.log(currentFormat);
    console.log(currentColor);

    const switchFormat = (format, color?) => {
      switch (format) {
        case 'json':
          output.value = json(data)
          break;
        case 'css':
          output.value = css(data, color)
          break;
        case 'scss':
          output.value = scss(data, color)
          break;
        default:
          output.value = json(data)
      }
    }

    const switchFormatHandler = (e) => {
      const activeClass = 'active';
      const current = Array.from(buttons).find((element) => {
        return element.classList.contains(activeClass);
      });
      const selected = e.target;

      currentFormat = selected.dataset.format;

      if(currentFormat === "json") {
        options.disabled = true;
      } else {
        options.disabled = false;
      }

      switchFormat(currentFormat, currentColor);

      current.classList.remove(activeClass);
      selected.classList.add(activeClass);
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
      }, 1000)
    })

    buttons.forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', switchFormatHandler);

      if(button.classList.contains('active') && (button).dataset.format === "json") {
        options.disabled = true;
      }
    })

    options.addEventListener('change', (e) => {
      currentColor = (<HTMLInputElement>event.target).value; 

      switchFormat(currentFormat, currentColor);
    })

    switchFormat('json');
  }
};