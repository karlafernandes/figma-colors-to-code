const defaultColor = (style) => style.opacity < 1 ? style.rgba : style.hex;

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
          opacity: Math.round(item.opacity * 10) / 10
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
      color = item.opacity < 1 ? item.hexa : item.hex;
    } else if(format == "rgb") {
      color = item.opacity < 1 ? item.rgba : item.rgb;
    } else if(format == "hsl") {
      color = item.opacity < 1 ? item.hsla : item.hsl;
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
      color = item.opacity < 1 ? item.hexa : item.hex;
    } else if(format == "rgb") {
      color = item.opacity < 1 ? item.rgba : item.rgb;
    } else if(format == "hsl") {
      color = item.opacity < 1 ? item.hsla : item.hsl;
    } else {
      color = defaultColor(item);
    }

    return `$${item.name.replace(/ /g, '-').replace(/-\/-/g, '-').toLowerCase()}: ${color};`;
    }).join('\n');

  const result = properties;

  return result;
}
