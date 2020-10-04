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

// https://eemeli.org/yaml/#documents
// Document.Parsed
const deepValuesYAMLDoc = (item, fnc) => {
  if (item.type === "PLAIN") { // Array of String
    item.value = fnc(item.value)
    return true
  }

  if (item.type === "MAP") { // Array of Objects
    return item.items.forEach(item2 => {
      return deepValuesYAMLDoc(item2, fnc)
    })
  }

  if (["QUOTE_DOUBLE", "QUOTE_SINGLE"].includes(item.value.type)) { // value String
    item.value.value = fnc(item.value.value)
    return true
  }

  if (item.value.type === "PLAIN") { // value number
    item.value.value = fnc(item.value.value)
    return true
  }

  if (item.value.type === "MAP") { // value object
    return item.value.items.forEach(item2 => {
      return deepValuesYAMLDoc(item2, fnc)
    })
  }

  if (item.value.type === "SEQ") { // value array
    return item.value.items.forEach(item2 => {
      deepValuesYAMLDoc(item2, fnc)
    })
  }
  // if (item.value.type === "ALIAS") {
  //   return true
  // }
  // console.log(item)
}


module.exports = { transformValues, deepValuesYAMLDoc, isPromiseOrAsync, isObject, resolveSubTypes };
