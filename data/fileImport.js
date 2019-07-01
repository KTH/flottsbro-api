const fs = require("fs");
const path = require("path");
const readline = require("readline");
const deploys = require("../server/models/deployments.js");
const log = require("kth-node-log");

let _importCsv = function importCsv(filename) {
  let file = path.resolve(__dirname, filename);

  let readLine = readline.createInterface({
    input: fs.createReadStream(file),
    console: false
  });

  let keys = "";
  var i = 0;
  var deployments = [];

  readLine.on("line", function(line) {
    if (_isHeaderRow(i)) {
      keys = _toArray(line);
    } else {
      let deployment = _toKeyValueJson(keys, _toArray(line));
      deployment = deploys.add(deployment);
    }
    i++;
  });
};

function _isHeaderRow(lineNumber) {
  return lineNumber == 0;
}

function _toArray(row) {
  return row.split(";").map(function(item) {
    return item.trim();
  });
}

function _toKeyValueJson(keys, values) {
  let i = 0;
  let result = {};
  keys.forEach(key => {
    result[key] = values[i];
    i++;
  });
  return result;
}

module.exports = {
  importCsv: _importCsv
};
