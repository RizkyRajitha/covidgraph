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
  const [Chart2props, setChart2props] = useState([]);
  const [Chart3props, setChart3props] = useState([]);

  useEffect(() => {
    setisLoading(true);
    axios
      .get(API)
      .then(result => {
        console.log(result.data);
        setdata(result.data.data);
        setisLoading(false);

        var time = new Date(result.data.updateTime);

        var tzDifference = time.getTimezoneOffset();
        //convert the offset to milliseconds, add to targetTime, and make a new Date
        var offsetTime = new Date(time.getTime() + tzDifference * 60 * 1000);

        setupdatetime(offsetTime.toLocaleString());

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
          }
        ];

        var dataObj2 = [
          {
            id: "",
            color: "hsl(253, 70%, 50%)",
            data: ttlnewcases
          }
        ];

        var dataObj3 = [
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
        setChart2props(dataObj2);
        setChart3props(dataObj3);

        console.log(dataObj3[1]);
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
        <App
          data={Chartprops}
          linecolor="	#ff4000"
          legendName={"Local total cases"}
        />
      </div>
      <div id="graphdiv" className=" container chartdiv">
        <App
          symbolhide={true}
          data={Chart2props}
          linecolor="#fa0000"
          legendName={"Local new cases"}
        />
      </div>
      <div id="graphdiv" className=" container chartdiv">
        <App
          data={Chart3props}
          legendName={"Local deaths"}
          yscalemax={Chart3props[1] && parseInt(Chart3props[1].data[20].y) + 10}
        />
      </div>
      <div className="tablediv container ">
        <div className="table-responsive  ">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Local new cases</th>
                <th scope="col">
                  Local total cases{" "}
                  {/* <span className="smallnote">including chinese paincient</span>{" "} */}
                </th>
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
            <img
              alt="github logo"
              className="foottileimg"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADTUlEQVRoge2ZS0hUURjHv+tbs7IkgizRXERWUCq2UAIRoZ0Ld0WbksoayLIWUUHQJqSHtqm2tQgKBINWhRGE9iAwk0ishZVBplCkFUn+Wtw7MhzPeM69c0eJ5g/DwHe+83/MnXvuOTMiKaTwf8MJiwhYLyLbRaRCRLaJyFoRKRCRTBH5KiITIjIkIv0i8kBEBhzHISz9QACWAs1AL/4xApwFihbDeCbQBnwLYFzFT6ADKFwo83XA6xCMq/gMNCXb/H5gOgnmY3EdyAzbeAZwNcnGY3EXyAozwLUFNB9FN5Aehvnji2A+iguJmm8A/sQhPwCUee8vA5gbBo4Bm4DGefoag5rP8UTioVTpb8JdSUyYxF0M0mLmFs3TPwoUBAlwxmAkVzOnGPfhVO+ZyvVeRcAO4DRQpZmXZdBq92t+BTBlIA1tlbAIMAWs1s1N0xVFZI+I5Bl0/V/W+FhpGM8TkX26gXgBtM0Ktlj02KLcomcvYN58AuWGywkwRoibMNx7ZMxCd7M6V3cFqi00I47jjCZu3YXH1WLR2qAWdAEqDST9InLHQswvukTkmaFnjjddgK0GkhvJOIh4nDcNbRvVgi7AcgPJfVtTAdBjGF+jFnQBsg0kI9Z2/OODYXyZWtAFCG8bGz7m7E51Ab4bSIrD8aJFiWF8Qi3oArw1kOy0dRMAJu5xtaALMGwgiaDZyCUKIE9EIoa292pBF2DQQFIiIpfsbPnCZTF/PXuNLEAhdgf3DiAjUde45+1OCz2AWlvSHkvCp0BNAuZrgeeWWuOAaYmfJT5oSRpFH9AClFlwlwGHgCc+NS76+WRygI8KwW6gGhicR6TNgrvdp3GAGWCDdQBP6LCGaBfu1veTZqzbkjcdGPAZ4JYv855QNvBGIXoHOEAN8FsZq/fB3ezD/CSwzncAT6gC+KUQVnpjdcAr4AfwGHcdt+Ut9RHgRCDzMWKtCuHthAhl9tdtG3Rhc4w0iDnAFYX4SAghTBgA8hPViYo5uA+uWPQBp4AIcC7kAC+AVaGYV0RPMvfmBfB9QpvH/ENgzr4/NABVwFASAkwD5wn7v4E44vne1fgSFQ/AMRNj/hFQkQyvJhNLgKNAa4C5ncA9oC4Z3lJIIYV/BH8BXU0eZg72N1UAAAAASUVORK5CYII="
            />
          </a>

          <a
            rel="noopener noreferrer"
            href="https://t.me/covid19lk"
            className="linkref float-left"
            target="_blank"
          >
            <img
              alt="telegrame logo "
              className="foottileimg"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADcUlEQVRoge3YS4iVZRzH8XEamhnwknQzKOhKErUoDKWMkowKGWhTi6CiFmE3WoQUKS4iqBYGQSAtYmgRhZVJ0EJqYWBlNyuDwEAGtSzI8jKTWpN+Wjzv1Mtznvd2mnPO5vyWz/t/fv/v/7zn/1zegYG++uqrr74iYQEexw5MYj/WYrDXbKXCldiYQaf0dK8ZW4TTMIYPcKoAfEZ7es37r7AI6/FTBXRek73mHsByvIE/K2D34fVobHevoEdwL76u8Stvx50YwsPRs03dBr8Ez+NgBfRRvIKrovmvRnFPdQN6ECuxCX9XgP+AJ7GwwOubKP6WToIvwIP4vgL6pLDijGFOid8I/ormntkJ8Kuz1z9VAX4IL+HCmr5Lo/kTswl9Ou7GJxXQhN30HgwX+KzBV4lnD0U+78wG+Pl4Fr9UQB/HOJaUeI0JPfA7rkk8jxu4/V0YK/A2pivAJ4SmPKvE6wpszeIP4dqCuLiBb20KPVdoym8roMmt3SV+C4UldWYDO4KlBbGpBj67Cfwj+K0C+rDQlJdXeA1lfvm94AiWlcyJG3hvE/hHK8C/w2rMreG1MovP6yiuq5gX78CbmxSwJwE9jbdwU02PS7El4TOJ5TXmxw28tkkBqfX8TRV/lWzuPLyAEwmPKdxQkyFu4NuaFLC1NTfCWX2bsP4PR3MG8QB+Lpg7hRtr5h/Vuto1auDLcKAAZEYHsQGLcT2+KIn9Aysa5I8beF9t+JzJGXhO9SmS8lvUMdzcMHfcwO82LiBnNiys73Wue7FOYFUbOccjn/oNXGG8GC+q91ZOarpz/pcn3jhvn5UCcglGcF/FG9nZpneqgc+d1QJyyT4tKWBDFPsEnqnhuSzy2d8R+BxUkVZlMUN4OTe+UcnHKa2ngPYbuEYBF0j/jaYxX9jU3k883yxxN8g8x6PYdR0rIEv4WQJwBy5WfrX8EPMSfruiuNlt4ETCNQm4j/BrCfyMPpa7zEs38KJOF3CRevvDduxOjO/CeZlX3MA/dhQ+V0TZMYJwEBzFOdiZeD4hHF8ei8a3dKuAovvDKayT+3QifHrZlog9kBhf360C5mu95B/DXQXxo3ivoOi8Gh9D/k8RS4S/0nGhiQu/RmTxQ3itBP4wRrvF35YwRziSp3R/r/lqSzjtfilcej7HHb1m6quvvvqqr38ABA4FXrQ6dZYAAAAASUVORK5CYII="
            />{" "}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
