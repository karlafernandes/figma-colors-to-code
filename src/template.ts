export const json = function(params) {
  const result = {
    colors: params.filter(item => item.type === 'SOLID').map(item => {
      const color = formatColor(item);
      return {name: item.name, value: color}
    })
  }
  
  return JSON.stringify(result, null, 2);
}

export const css = function(params) {
  const start = ":root {"
  const end = "}"
  const properties = params.filter(item => item.type === 'SOLID').map(item => {
    const color = formatColor(item);
    return `  --${item.name.replace(/ /g, '-').replace(/-\/-/g, '-').toLowerCase()}: ${color};`;
    }).join('\n');

  const result = start + "\n" + properties + "\n" + end;

  return result;
}

export const scss = function(params) {
  const properties = params.filter(item => item.type === 'SOLID').map(item => {
    const color = formatColor(item);
    return `$${item.name.replace(/ /g, '-').replace(/-\/-/g, '-').toLowerCase()}: ${color};`;
    }).join('\n');

  const result = properties;

  return result;
}

const formatColor = (style) => {
    if (style.opacity < 1) {
      return style.rgba;
    } else {
      return style.hex;
    }
}