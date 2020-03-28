const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bp = require("body-parser");
const Data = require("./models/data");
const port = process.env.PORT || 3001;

mongoose.Promise = global.Promise;

const mongodbAPI = process.env.mongodbAPI || require("./config/env").mongodbAPI;

const app = express();
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.set("trust proxy", true);

app.get("/data", (req, res) => {
  console.log("get data");
  Data.find({})
    .sort({ update_date_time: -1 })
    .then(result => {
      console.log(result);

      var payload = [];

      result.forEach(element => {
        var update = new Date(element.update_date_time).toLocaleString(
          "en-us",
          { month: "long", year: "numeric", day: "numeric" }
        );

        var tempobj = {
          update_date_time: update.slice(0, 8),
          local_deaths: element.local_deaths,
          local_new_deaths: element.local_new_deaths,
          local_total_cases: element.local_total_cases,
          local_new_cases: element.local_new_cases
        };

        payload.push(tempobj);
      });

      res.json(payload.reverse());
    })
    .catch(err => {
      console.log(err);
    });
});

try {
  mongoose.connect(
    mongodbAPI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (!err) {
        console.log("connected to mongodb sucsessfully" + "👍");
      }
      //   console.log(err);
    }
  );
} catch (err) {
  console.log(err);
}

console.log("env - ", process.env.NODE_ENV);

mongoose.set("debug", true);

app.listen(port, () => {
  console.log("listning on " + port);
});
