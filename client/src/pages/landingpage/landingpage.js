import React, { useEffect, useState } from "react";
// import Navbar from "../../components/navbar";
// import Footer from "../../components/footer/footer";
import "./landingpage.scoped.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
// const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];
const API =
  "https://lvv3icabfe.execute-api.us-east-1.amazonaws.com/default/helloworld";
const axios = require("axios").default;

const Landingpage = () => {
  const [data, setdata] = useState([]);
  const [updatetime, setupdatetime] = useState("");
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setisLoading(true);
    axios
      .get(API)
      .then(result => {
        console.log(result.data);
        setdata(result.data.data);
        setisLoading(false);

        var time = new Date(result.data.updateTime);

        setupdatetime(time.toLocaleString());
      })
      .catch(err => {
        setisLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <div className="">
      <nav class="navbar navbar-expand-md navbar-dark bg-primary  ">
        <div class="mx-auto order-0">
          <span class="navbar-brand mx-auto" href="#">
            Graphical Representatoin of covid-19 report Sri lanka
          </span>
        </div>
      </nav>
      <div className="container graphOuter">
        <div className="felxdiv">
          {" "}
          <div className="spinnerdashboard">
            <div
              hidden={!isLoading}
              className="spinner-border text-primary loading"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
        <div className="container  graphInner">
          {data[0] && (
            <ResponsiveContainer width="80%" height="80%">
              <LineChart
                className="chartsvg"
                data={data}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="update_date_time" />

                <YAxis type="number" domain={[0, "dataMax + 20"]} />

                <Tooltip />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="local_total_cases"
                  name="Total Cases"
                  stroke="#0F52BA"
                  // activeDot={{ r: 8 }}
                />

                <Line
                  type="monotone"
                  dataKey="local_new_cases"
                  stroke="#EC1A28"
                  name="New Cases"
                  // activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="updatediv">Last update : {data[0] && updatetime}</div>
      </div>
      <footer class="mastfoot mt-auto bg-primary ">
        <div class="inner">
          <a href="https://hpb.health.gov.lk/en" className="linkref">
            Reference HEALTH PROMOTION BUREAU Sri Lanka
          </a>
          <br />
          <a
            href="https://github.com/RizkyRajitha/covidgraph"
            className="linkref"
          >
            <i class="fab fa-github fa-2x"></i>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
