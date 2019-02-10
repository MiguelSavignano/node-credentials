const ejs = require("ejs");

const render = (templateString, variables) => {
  const result = ejs.render(templateString, { process, ENV: process.env });
  return result;
};

module.exports.render = render;
