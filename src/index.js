const parser = require("../parser/generator");
const {
  doc: {
    builders: { concat, hardline, group, indent, line, join, softline },
  },
} = require("prettier");

const languages = [
  {
    extensions: [".aspx", ".ascx", ".inc"],
    name: "ASPX",
    parsers: ["aspx-parse"],
  },
];

const parsers = {
  "aspx-parse": {
    parse: (text) => parser.parse(text),
    astFormat: "aspx-ast",
  },
};

function printASPX(path, options, print) {
  const node = path.getValue();

  if (Array.isArray(node)) {
    return concat(path.map(print));
  }

  switch (node.type) {
    case "Assign":
      return concat([node.key, " = ", path.call(print, "value"), hardline]);
    case "String":
      return concat(['"', node.value, '"']);
    case "Integer":
      return node.value.toString();
    case "Boolean":
      return node.value.toString();
    case "Date":
      return node.value.toISOString();
    case "ObjectPath":
      return concat(["[", node.value.join("."), "]", hardline]);
    case "Array":
      return group(
        concat([
          "[",
          indent(
            concat([
              softline,
              join(concat([",", line]), path.map(print, "value")),
            ])
          ),
          softline,
          "]",
        ])
      );
    default:
      return "";
  }
}

const printers = {
  "aspx-ast": {
    print: printASPX,
  },
};

module.exports = {
  languages,
  parsers,
  printers,
};
