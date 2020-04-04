import React, { Component } from "react";

import Landingpage from "./pages/landingpage/landingpage";

import ReactGA from "react-ga";
ReactGA.initialize("UA-162182073-1");
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  render() {
    return <Landingpage />;
  }
}

export default App;
