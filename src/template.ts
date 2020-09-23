const defaultColor = (item) => item.alpha < 1 ? item.rgba : item.hex;

export const json = function(params) {
  const result = {
    colors: params.filter(item => item.type === 'SOLID').map(item => {
      const color = defaultColor(item);
      return {
        name: item.name,
        values: {
          hex: item.hex,
          hexa: item.hexa,
          rgb: item.rgb,
          rgba: item.rgba,
          hsl: item.hsl,
          hsla: item.hsla,
          alpha: item.alpha
        }
      }
    })
  }
  
  return JSON.stringify(result, null, 2);
}

export const css = function(params, format?) {
  const start = ":root {"
  const end = "}"
  const properties = params.filter(item => item.type === 'SOLID').map(item => {
    let color;

    if(format == "hex") {
      color = item.alpha < 1 ? item.hexa : item.hex;
    } else if(format == "rgb") {
      color = item.alpha < 1 ? item.rgba : item.rgb;
    } else if(format == "hsl") {
      color = item.alpha < 1 ? item.hsla : item.hsl;
    } else {
      color = defaultColor(item);
    }

    return `  --${item.name.replace(/ /g, '-').replace(/-\/-/g, '-').toLowerCase()}: ${color};`;
  }).join('\n');

  const result = start + "\n" + properties + "\n" + end;

  return result;
}

export const scss = function(params, format?) {
  const properties = params.filter(item => item.type === 'SOLID').map(item => {
    let color;

    if(format == "hex") {
      color = item.alpha < 1 ? item.hexa : item.hex;
    } else if(format == "rgb") {
      color = item.alpha < 1 ? item.rgba : item.rgb;
    } else if(format == "hsl") {
      color = item.alpha < 1 ? item.hsla : item.hsl;
    } else {
      color = defaultColor(item);
    }

    return `$${item.name.replace(/ /g, '-').replace(/-\/-/g, '-').toLowerCase()}: ${color};`;
    }).join('\n');

  const result = properties;

  return result;
}

export const android = function(params, format?) {
  const start = `<?xml version="1.0" encoding="UTF-8"?>\n<resources>`
  const end = `</resources>`
  const properties = params.filter(item => item.type === 'SOLID').map(item => {
    let color;

    if(item.alpha < 1) {
      color = item.hexa.replace(/#(......)(..)/g, '#$2$1')
    } else {
      color = item.hex
    }

    return `  <color name="${item.name.replace(/ /g, '_').replace(/_\/_/g, '_').toLowerCase()}">${color}</color>`
  }).join('\n');

  const result = start + "\n" + properties + "\n" + end;

  return result;
}