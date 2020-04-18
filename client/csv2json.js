const axios = require("axios").default;

axios
  .get(
    "https://raw.githubusercontent.com/arimacdev/covid19-srilankan-data/master/Districts/districts_lk.csv"
  )
  .then((result) => {
    console.log(result.data);
    console.log(JSON.parse(csvJSON(result.data)));
  })
  .catch((err) => {
    console.log(err);
  });

function csvJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}
