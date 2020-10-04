const YAML = require('yaml');

function isObject(variable) {
  return variable !== undefined && variable !== null && variable.constructor === Object;
}

function isPromiseOrAsync(variable) {
  return (
    variable !== undefined &&
    variable !== null &&
    variable.constructor &&
    (variable.constructor.name === 'Promise' || variable.constructor.name === 'AsyncFunction')
  );
}

const resolveSubTypes = (value, fnc) => {
  if (isObject(value)) {
    return transformValues(value, fnc);
  } else if (Array.isArray(value)) {
    const subTypesResult = value.map((subValue) => resolveSubTypes(subValue, fnc));
    if (isPromiseOrAsync(fnc)) {
      return Promise.all(subTypesResult);
    }
    return subTypesResult;
  } else if (typeof value === 'string' || typeof value == 'number') {
    return fnc(value);
  }
  return value;
};
// Only transform string or numbers, transform only deep values for Objects and Arrays
const transformValues = (object, fnc) => {
  if (isPromiseOrAsync(fnc)) {
    return Object.entries(object).reduce(async (memo, [key, value]) => {
      const result = await memo;
      result[key] = await resolveSubTypes(value, fnc);
      return result;
    }, Promise.resolve({}));
  }
  return Object.entries(object).reduce((memo, [key, value]) => {
    const result = memo;
    result[key] = resolveSubTypes(value, fnc, { async: false });
    return result;
  }, {});
};

const yAMLDocResolveSubTypes = (item) => {
  if (item.type === "MAP") { // item Array
    return item.items.forEach(item2 => {
      return yAMLDocResolveSubTypes(item2)
    })
  }

  if (item.value.type === "QUOTE_DOUBLE") { // value String
    item.value.value = `${item.value.value} encrpted`
    return true
  }

  if (item.value.type === "PLAIN") { // value number
    item.value.value = `${item.value.value} encrypted`
    return true
  }

  if (item.value.type === "MAP") { // value object
    return item.value.items.forEach(item2 => {
      return yAMLDocResolveSubTypes(item2)
    })
  }

  if (item.value.type === "ALIAS") {
    return true
  }
  if (item.value.type === "SEQ") {
    return item.value.items.forEach(item2 => {
      yAMLDocResolveSubTypes(item2)
    })
  }
  // console.log(item.value.type)
}

// https://eemeli.org/yaml/#documents
// Document.Parsed
const transformYAMLDocValues = (text, fnc) => {
  const doc = YAML.parseDocument(text, { merge: false });
  return new Promise(async (resolve, reject) => {
    doc.contents.items.forEach(item => {
      yAMLDocResolveSubTypes(item)
    })
    resolve(doc);
  });
};

module.exports = { transformValues, transformYAMLDocValues, isPromiseOrAsync, isObject, resolveSubTypes };
