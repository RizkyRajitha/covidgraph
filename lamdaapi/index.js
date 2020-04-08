const mongoose = require("mongoose");
const axios = require("axios").default;
const Data = require("./models/data");

mongoose.Promise = global.Promise;
let conn = null;
const mongodbAPI = process.env.mongodbAPI || require("./config/env").mongodbAPI;

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (conn == null) {
    conn = await mongoose.createConnection(mongodbAPI, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
    });
    // conn.model("Data", new mongoose.Schema({ name: String }));
    console.log("connected to mongodb sucsessfully" + "👍");
  }

  const M = conn.model("Data");

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

  const doc = await M.find({}).sort({ update_date_time: -1 });
  const districtData = await axios.get(
    "https://raw.githubusercontent.com/arimacdev/covid19-srilankan-data/master/Districts/districts_lk.csv"
  );

  console.log(districtData.data);
  const districtJson = JSON.parse(csvJSON(districtData.data));

  console.log(districtJson);

  districtJson.map((element) => {
    if (element.district === "Ampara") {
      element.latitude = "7.301679";
      element.longitude = "81.674155";
    }

    if (element.district === "Monaragala") {
      element.latitude = "6.890553";
      element.longitude = "81.344147";
    }
  });

  districtJson.map((a) => (a.cases = parseInt(a.cases)));

  console.log(doc);
  console.log(districtJson);
  districtJson.pop()

  var payload = [];

  doc.forEach((element) => {
    var update = new Date(element.update_date_time).toLocaleString("en-us", {
      month: "long",
      year: "numeric",
      day: "numeric",
    });

    console.log(update);

    var tempobj = {
      update_date_time: update.slice(0, 8),
      local_deaths: element.local_deaths,
      local_new_deaths: element.local_new_deaths,
      local_total_cases: element.local_total_cases,
      local_new_cases: element.local_new_cases,
    };

    payload.push(tempobj);
  });

  var payloadObj = {
    districtData: districtJson,
    data: payload.reverse(),
    updateTime: doc[0].update_date_time,
  };

  var response = {
    statusCode: "200",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(payloadObj),
  };

  return response;
};
