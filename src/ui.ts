import './ui.css'
import { json, css, scss } from './template';

parent.postMessage({ pluginMessage: { type: 'collect-tokens' } }, '*')

onmessage = message => {
  if (message.data.pluginMessage.type == "collect-tokens") {

    // TODO: nav操作で切り替え
    // TODO: コピーボタン
    // TODO: HEXとRGBA
    
    let params = "";

    const element: HTMLInputElement =<HTMLInputElement>document.getElementById('output');
    const value: string = element.value;

    element.value = scss(message.data.pluginMessage.data);
  }
};