figma.showUI(__html__, { width: 560, height: (41 + 40 + 320) });

// RGBをHEXに変換する
const RGB2HEX = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

// Color Stylesで定義されたスタイル
const styles = figma.getLocalPaintStyles();
const colorCollection = styles.map(style => {
  const color = style.paints[0];

  // RGBの値を取得し、10進数で返す
  const r = color.type === 'SOLID' ? Math.round(color.color.r * 255) : null;
  const g = color.type === 'SOLID' ? Math.round(color.color.g * 255) : null;
  const b = color.type === 'SOLID' ? Math.round(color.color.b * 255) : null;
  
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const hex = RGB2HEX(r, g, b).toUpperCase();

  return {
    name: style.name,
    rgb: rgb,
    hex: hex,
    opacity: color.opacity,
    // remote: color.remote,
    // paints: color.paints,
  }
})

figma.ui.onmessage = message => {
  if (message.type === 'collect-tokens') {

    figma.ui.postMessage({
      type: "collect-tokens",
      data: colorCollection
    });

    // console.log(colorCollection);
  }

  // figma.closePlugin();
};

