const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var dataSchema = new Schema({
  local_recovered: {
    type: String
  },
  local_deaths: {
    type: String
  },
  local_new_deaths: {
    type: String
  },
  local_total_number_of_individuals_in_hospitals: {
    type: String
  },
  local_active_cases: {
    type: String
  },
  local_total_cases: {
    type: String
  },
  local_new_cases: {
    type: String
  },
  update_date_time: {
    type: String
  },
  hospitals_info: {
    type: String
  }
});

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
