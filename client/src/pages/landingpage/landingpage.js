import React, { useEffect, useState } from "react";

import App from "./chart";
import "./landingpage.scoped.css";

const API =
  "https://lvv3icabfe.execute-api.us-east-1.amazonaws.com/default/helloworld";
const axios = require("axios").default;

const Landingpage = () => {
  const [data, setdata] = useState([]);
  const [updatetime, setupdatetime] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [Chartprops, setChartprops] = useState([]);

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

        var ttlcases = [];
        var ttlnewcases = [];
        var newdeaths = [];
        var totaldeaths = [];

        result.data.data.forEach(element => {
          var tempttlcases = {
            y: element.local_total_cases,
            x: element.update_date_time
          };
          var tempttlnewcases = {
            y: element.local_new_cases,
            x: element.update_date_time
          };

          var temptnewdeaths = {
            y: element.local_new_deaths,
            x: element.update_date_time
          };

          var temptttldeaths = {
            y: element.local_deaths,
            x: element.update_date_time
          };
          totaldeaths.push(temptttldeaths);
          newdeaths.push(temptnewdeaths);
          ttlcases.push(tempttlcases);
          ttlnewcases.push(tempttlnewcases);
        });

        var dataObj = [
          {
            id: "Local total cases",
            color: "hsl(253, 70%, 50%)",
            data: ttlcases
          },
          {
            id: "Local new cases",
            color: "hsl(253, 70%, 50%)",
            data: ttlnewcases
          },
          {
            id: "Local new deaths",
            color: "hsl(253, 70%, 50%)",
            data: newdeaths
          },
          {
            id: "Local total deaths",
            color: "hsl(253, 70%, 50%)",
            data: totaldeaths
          }
        ];

        setChartprops(dataObj);
      })
      .catch(err => {
        setisLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary  ">
        <div className="mx-auto order-0">
          <span className="navbar-brand mx-auto navtitle " href="#">
            Graphical Representation of COVID-19 report Sri Lanka
          </span>
        </div>
      </nav>
      <div id="graphdiv" className=" container chartdiv">
        <div className="spinnerdashboard">
          <div className="spinnerinnerdiv">
            <div
              hidden={!isLoading}
              className="spinner-border text-primary loading"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <span className="navtitle" hidden={isLoading}>
              Last update : {updatetime && updatetime}
            </span>
          </div>
        </div>
        <App data={Chartprops} />{" "}
      </div>
      <div className="tablediv container ">
        <div className="table-responsive  ">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Local total cases</th>
                <th scope="col">Local new cases</th>
                <th scope="col">Local new Deaths</th>
                <th scope="col">Local total Deaths</th>
              </tr>
            </thead>
            <tbody>
              {data.map((ele, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{ele.update_date_time}</td>
                    <td>{ele.local_new_cases}</td>
                    <td>{ele.local_total_cases}</td>
                    <td>{ele.local_new_deaths}</td>
                    <td>{ele.local_deaths}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <footer className=" text-muted navtitle mastfoot mt-auto bg-primary ">
        <div className="container">
          <a
            rel="noopener noreferrer"
            href="https://hpb.health.gov.lk/en"
            target="_blank"
            className="linkref foottile"
          >
            Reference : HEALTH PROMOTION BUREAU SRI LANAKA
          </a>
          {/* <br /> */}
          <a
            rel="noopener noreferrer"
            href="https://github.com/RizkyRajitha/covidgraph"
            className="linkref float-right"
            target="_blank"
          >
            <i className="fab fa-github fa-2x"></i>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
