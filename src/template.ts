export const json = function(params) {
  const result = {
    colors: params.map(item => {
        return {name: item.name, value: item.rgb}
      })
  }
  
  // return result;
  return JSON.stringify(result, null, 2);
}

export const css = function(params) {
  const start = ":root {"
  const end = "}"
  const properties = params.map(item => {
    return `  --${item.name.replace(" ", '-').toLowerCase()}: ${item.rgb};`;
    }).join('\n');

  const result = start + "\n" + properties + "\n" + end;

  return result;
}

export const scss = function(params) {
  const properties = params.map(item => {
    return `$${item.name.replace(" ", '-').toLowerCase()}: ${item.rgb};`;
    }).join('\n');

  const result = properties;

  return result;
}

