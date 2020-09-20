const YAML = require('yaml');
const fs = require('fs');
const { transformValues } = require('./src/transformValues');

YAML.defaultOptions.merge = true;
const text = fs.readFileSync('credentials.yaml', 'utf-8');

const encrypted = (value) => {
  return `${value} encrypted`;
};

const doc = YAML.parseDocument(text, { merge: true });
doc.anchors.getNames().forEach((anchorName) => {
  const anchorObj = doc.anchors.map[anchorName].toJSON();
  const objEncrypted = transformValues(anchorObj, (value) => {
    return encrypted(value);
  });
  Object.keys(anchorObj).forEach((key) => {
    doc.anchors.map[anchorName].set(key, objEncrypted[key]);
  });
});

console.log(doc.toString());
// console.log(YAML.stringify(doc));
