const axios = require("axios").default;

const healthLKAPI = "https://hpb.health.gov.lk/api/get-current-statistical";

var latestUpdate = null;

const bot_id = process.env.bot_id || require("./config/env").bot_id;

const chat_id = process.env.chat_id || require("./config/env").chat_id_group;

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const mongodbAPI = process.env.mongodbAPI || "mongodb://127.0.0.1:27017/covid19";

const Data = require("./models/data");

try {
  mongoose.connect(
    mongodbAPI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (!err) console.log("connected to mongodb sucsessfully" + "👍");
    }
  );
} catch (error) {
  console.log(err);
}

setInterval(() => {
  refresh();
}, 30000);

function refresh() {
  axios
    .get(healthLKAPI)
    .then(result => {
      if (result.data.message === "Success") {
        // console.log(result.data);
        console.log("total cases ", result.data.data.local_total_cases);
        console.log("updatedAt ", result.data.data.update_date_time);

        var datasource = result.data.data;

        if (latestUpdate !== result.data.data.update_date_time) {
          console.log("new update");

          var diffdate = new Date(latestUpdate);

          var diff2date = new Date(
            new Date(result.data.data.update_date_time).toISOString()
          );

          var d1 = diff2date.toDateString();
          var d2 = diffdate.toDateString();

          if (d1 === d2) {
            console.log("update");
            Data.find({})
              .sort({ update_date_time: -1 })
              .then(doc1 => {
                Data.findOneAndUpdate(
                  { _id: doc1[0]._id },
                  {
                    $set: {
                      local_recovered: datasource.local_recovered,
                      local_deaths: datasource.local_deaths,
                      local_new_deaths: datasource.local_new_deaths,
                      local_total_number_of_individuals_in_hospitals:
                        datasource.local_total_number_of_individuals_in_hospitals,
                      local_active_cases: datasource.local_active_cases,
                      local_total_cases: datasource.local_total_cases,
                      local_new_cases: datasource.local_new_cases,
                      update_date_time: new Date(
                        datasource.update_date_time
                      ).toISOString(),
                      hospitals_info: JSON.stringify(datasource.hospital_data)
                    }
                  }
                )
                  .then(result => {
                    console.log(result);
                  })
                  .catch(err => {
                    console.log(err);
                    axios
                      .post(
                        `https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/sendMessage?chat_id=XXXXXXXXXXXXX&text=DB%20update%20error%20${JSON.stringify(
                          err
                        )}`
                      )
                      .then(result => {})
                      .catch(err => {
                        console.log(err);
                      });
                  });
              })
              .catch(err => {
                console.log(err);

                axios
                  .post(
                    `https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/sendMessage?chat_id=XXXXXXXXXXXXX&text=DB%20find%20error%20${JSON.stringify(
                      err
                    )}`
                  )
                  .then(result => {})
                  .catch(err => {
                    console.log(err);
                  });
              });
          } else {
            console.log("new day");
            var newdata = new Data({
              local_recovered: datasource.local_recovered,
              local_deaths: datasource.local_deaths,
              local_new_deaths: datasource.local_new_deaths,
              local_total_number_of_individuals_in_hospitals:
                datasource.local_total_number_of_individuals_in_hospitals,
              local_active_cases: datasource.local_active_cases,
              local_total_cases: datasource.local_total_cases,
              local_new_cases: datasource.local_new_cases,
              update_date_time: new Date(
                datasource.update_date_time
              ).toISOString(),
              hospitals_info: JSON.stringify(datasource.hospital_data)
            });

            newdata
              .save()
              .then(doc => {
                // console.log(doc);
              })
              .catch(err => {
                console.log(err);
                axios
                      .post(
                        `https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/sendMessage?chat_id=XXXXXXXXXXXXX4&text=DB%20newdayadd%20error%20${JSON.stringify(
                          err
                        )}`
                      )
                      .then(result => {})
                      .catch(err => {
                        console.log(err);
                      });
              });
          }

          latestUpdate = result.data.data.update_date_time;

          var time = new Date(datasource.update_date_time);

          var date = datasource.update_date_time.slice(0, 10);

          var hour = ("0" + time.getHours()).slice(-2);

          var minutes = ("0" + time.getMinutes()).slice(-2);

          var message = encodeURIComponent(
            `\n\nLatest Covid-19 🦠 Situation Report Sri lanka 🇱🇰 \n\nUpdate at 🕡 : ${date +
              " " +
              hour +
              ":" +
              minutes} \n\nNew cases 👨‍🦽 : ${
              datasource.local_new_cases
            }  \n\nTotal cases 😷 : ${
              datasource.local_total_cases
            }  \n\nActive cases 🛌 : ${
              datasource.local_active_cases
            }  \n\nTotal number of persons in hospitals 🏣 : ${
              datasource.local_total_number_of_individuals_in_hospitals
            } \n\nDeaths 🏴 : ${datasource.local_deaths} \n\nRecovered ✅ : ${
              datasource.local_recovered
            }\n\nSource : Health Promotion Bureau Sri Lanka`
          );

          axios
            .post(
              `https://api.telegram.org/bot${bot_id}/sendMessage?chat_id=${chat_id}&text=${message}`
            )
            .then(result => {
              console.log(result.data.ok);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("no updates");
        }
      } else {
        axios
          .post(
            `https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/sendMessage?chat_id=XXXXXXXXXXXXXXXXXXXX&text=covid%20api%20error%20${result.data.message}`
          )
          .then(result => {})
          .catch(err => {
            console.log(err);
          });
      }

      //   console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}
