figma.showUI(__html__, { width: 560, height: (41 + 56 + 320) });

// RGBをHEXに変換する
const rgb2hex = (r, g, b, a?) => {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a / 100 * 255).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  if (a.length == 1)
    a = "0" + a;

  // Alpha
  if(a === "NaN") {
    return "#" + r + g + b;
  } else {
    return "#" + r + g + b + a;
  }
}

const rgb2hsl = (r, g, b, a?) => {
  const RGB_MAX = 255;
	const HUE_MAX = 360;
	const SATURATION_MAX = 100;
	const LIGHTNESS_MAX = 100;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l;

	// Hue
	const hp = HUE_MAX / 6;
	if (max == min) {
		h = 0;
	} else if (r == max) {
		h = hp * ((g - b) / (max - min));
	} else if (g == max) {
		h = hp * ((b - r) / (max - min)) + HUE_MAX / 3;
	} else {
		h = hp * ((r - g) / (max - min)) + HUE_MAX * 2 / 3;
	}
	if (h < 0) {
		h += HUE_MAX;
	}

	// Saturation
	const cnt = (max + min) / 2;
	if (cnt < RGB_MAX / 2) {
		if (max + min <= 0) {
			s = 0;
		} else {
			s = (max - min) / (max + min) * SATURATION_MAX;
		}
	} else {
		s = (max - min) / (RGB_MAX * 2 - max - min) * SATURATION_MAX;
	}

	// Lightness
  l = (max + min) / RGB_MAX / 2 * LIGHTNESS_MAX;
  
  // Alpha
  if(!a) {
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  } else {
    return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a / 100})`;
  }
}

// Color Stylesで定義されたスタイル
const styles = figma.getLocalPaintStyles();
const colorCollection = styles.map(style => {
  const color = style.paints[0];

  // RGBの値を取得し、10進数で返す
  const r = color.type === 'SOLID' ? Math.round(color.color.r * 255) : null;
  const g = color.type === 'SOLID' ? Math.round(color.color.g * 255) : null;
  const b = color.type === 'SOLID' ? Math.round(color.color.b * 255) : null;

  const a = Math.round(color.opacity * 100);
  
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${a / 100})`;
  const hex = rgb2hex(r, g, b).toUpperCase();
  const hexa = rgb2hex(r, g, b, a).toUpperCase();
  const hsl = rgb2hsl(r, g, b);
  const hsla = rgb2hsl(r, g, b, a);

  return {
    type: color.type,
    name: style.name,
    rgb: rgb,
    rgba: rgba,
    hex: hex,
    hexa: hexa,
    hsl: hsl,
    hsla: hsla,
    opacity: color.opacity,
    // remote: color.remote,
    // paints: color.paints,
  }
})

async function getFormat() {
  let code = await figma.clientStorage.getAsync('code')
  let color = await figma.clientStorage.getAsync('color')

  const format = {
    code: code,
    color: color
  }

  // console.log(format)

  return format;
}

async function setFormat(codeFormat, colorFormat) {
  await figma.clientStorage.setAsync('code', codeFormat)
  await figma.clientStorage.setAsync('color', colorFormat)
}

const post = () => {
  figma.ui.postMessage({
    type: "collect-tokens",
    data: colorCollection,
    storage: storage
  });
}

let storage;

getFormat().then(result => {
  storage = result
}).then(post)

figma.ui.onmessage = message => {
  if (message.type === 'collect-tokens') {
    storage = message.storage;

    if(storage !== undefined) {
      setFormat(storage.code, storage.color);
    }
  }

  // figma.closePlugin();
};

