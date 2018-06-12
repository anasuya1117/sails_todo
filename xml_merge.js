const convert = require('xml-js');
const fs = require('fs');
// const extend = require('util')._extend;

const FAILURE_TO_WRITE = {
  "_attributes": {
    "name": "Cars-Api Test Coverage",
    "time": "0",
    "classname": "Coverage failure"
  },
  "failure": {
    "_attributes": {
      "type": ""
    },
    "_text": "Missing Test Coverage "
  }
};

const SUCCESS_TO_WRITE = {
  "_attributes": {
    "name": "Cars-Api Test Coverage",
    "time": "0",
    "classname": "Coverage success"
  }
};

const FAILURE_ESLINT_TO_WRITE = {
  "_attributes": {
    "name": "Cars-Api Eslint errors",
    "time": "0",
    "classname": "Eslint error"
  },
  "failure": {
    "_attributes": {
      "type": ""
    },
    "_text": "Eslint error"
  }
};

const SUCCESS_ESLINT_TO_WRITE = {
  "_attributes": {
    "name": "Cars-Api Lint Coverage",
    "time": "0",
    "classname": "Eslint success"
  }
};

var readUnitXML = readXML('./test-results.xml');
var readCloverXML = readXML('./coverage/clover.xml');
var readlintXML = readXML('./eslint.xml');

Promise.all([readUnitXML, readCloverXML, readlintXML]).then(data => {
  var unitJSON = convertXML2JS(data[0]);
  var cloverJSON = convertXML2JS(data[1]);
  var lintJSON = convertXML2JS(data[2]);


  var cloverResults = getCloverCount(cloverJSON);
  var lintResults = getlintCount(lintJSON);
  var unitResults = getUnitCount(unitJSON, cloverResults, lintResults);


  var unitResultXML = converJS2XML(unitResults);

  fs.writeFile('./unit.xml', unitResultXML, function(err) {
    if (err) throw err;
  });


}).catch(err => {
  console.log(err);
})

function converJS2XML(json) {
  var options = {
    ignoreComment: true,
    spaces: 4,
    compact: true
  };
  return convert.js2xml(json, options);
}

function convertXML2JS(xml) {
  return convert.xml2js(xml, {
    compact: true,
    spaces: 4
  });
}



function readXML(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) return reject(err);
      else return resolve(data);
    })
  });
}

function getCloverCount(cloverJson) {
  const metrics = cloverJson.coverage.project.metrics;
  const unconveredStatements = parseInt(metrics._attributes.statements) - parseInt(metrics._attributes.coveredstatements);

  return {
    totalStatements: parseInt(metrics._attributes.statements),
    coveredStatements: parseInt(metrics._attributes.coveredstatements),
    unconveredStatements
  }
}

function getlintCount(lintJson) {
  var err_count = 0;
  var lint_err_count = 0;
  var lint_success_marigin = 5;
  var lint_success_count = 0;
  const testsuite_count = lintJson.testsuites.testsuite;
  for (i = 0; i < testsuite_count.length; i++) {
    err_count = err_count + parseInt(lintJson.testsuites.testsuite[i]._attributes.errors);
  }


  if (err_count > 0) {
    if (err_count <= 20) {
      lint_err_count = 1;
    }
    if (err_count >= 20 && err_count <= 400) {
      lint_err_count = 2;
    }
    if (err_count > 400) {
      lint_err_count = 3;
    }
  }
  lint_success_count = lint_success_marigin - lint_err_count
  // console.log("err_count",err_count);
  return {
    lint_err_count: lint_err_count,
    lint_success_count: lint_success_count
  }
}

function getUnitCount(unitJson, cloverResults, lintResults) {

  var total = 0,
    failures = 0;
  if (Array.isArray(unitJson.testsuites.testsuite)) {
    unitJson.testsuites.testsuite.forEach(function(testsuite) {
      total += parseInt(testsuite._attributes.tests);
      failures += parseInt(testsuite._attributes.failures);
    });
  }

  var failurelintCount = lintResults.lint_err_count;
  var successlintcount = lintResults.lint_success_count;

  var totalUnitClover = total + cloverResults.totalStatements + failurelintCount + successlintcount;
  var totalfailure = failures + cloverResults.unconveredStatements + failurelintCount;
  var successUnitClover = cloverResults.coveredStatements;
  var failureUnitClover = cloverResults.unconveredStatements;


  // const unitJsonResult = Object.assign({} , unitJson);
  const unitJsonResult = JSON.parse(JSON.stringify(unitJson)); //for deep copy as Object.assign doesn't support deep copy..


  if (Array.isArray(unitJsonResult.testsuites.testsuite)) {
    unitJsonResult.testsuites.testsuite._attributes.tests = totalUnitClover;
    unitJsonResult.testsuites.testsuite._attributes.failures = totalfailure;

    if (failureUnitClover > 0) {
      for (var i = 0; i < failureUnitClover; i++) {
        unitJsonResult.testsuites.push(FAILURE_TO_WRITE);
      }
    }
    if (successUnitClover > 0) {
      for (var j = 0; j < successUnitClover; j++) {
        unitJsonResult.testsuites.push(SUCCESS_TO_WRITE);
      }
    }

    if (successlintcount > 0) {
      for (var i = 0; i < successlintcount; i++) {
        unitJsonResult.testsuites.push(SUCCESS_ESLINT_TO_WRITE);
      }
    }

    if (failurelintCount > 0) {
      for (var i = 0; i < failurelintCount; i++) {
        unitJsonResult.testsuites.push(FAILURE_ESLINT_TO_WRITE);
      }
    }
  }





  return unitJsonResult;
}
