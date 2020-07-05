import './ui.css'
import { json, css, scss } from './template';

parent.postMessage({ pluginMessage: { type: 'collect-tokens' } }, '*');

onmessage = message => {
  if (message.data.pluginMessage.type == "collect-tokens") {

    // TODO: prefixの付与
    // TODO: カスタムテンプレート

    const buttons = document.querySelectorAll('#format > button');
    const output: HTMLInputElement =<HTMLInputElement>document.getElementById('output');
    const copy = document.getElementById('copy');

    const data = message.data.pluginMessage.data;

    const switchFormat = (format) => {
      switch (format) {
        case 'json':
          output.value = json(data)
          break;
        case 'css':
          output.value = css(data)
          break;
        case 'scss':
          output.value = scss(data)
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

      switchFormat(selected.dataset.format);

      current.classList.remove(activeClass);
      selected.classList.add(activeClass);
    }

    copy.addEventListener('click', () => {
      output.select();
      document.execCommand('copy');
    })

    buttons.forEach((button) => {
      button.addEventListener('click', switchFormatHandler)
    })

    switchFormat('json');
  }
};