import { Component } from "preact";
import Land from "./pages/landingpage/landingpage";
import "./bootstrap.css";
import "./mapbox-gl.css";

import "./style";


import ReactGA from "react-ga";
ReactGA.initialize("UA-162182073-1");
ReactGA.pageview(window.location.pathname + window.location.search);

export default class App extends Component {
  render() {
    return (
      <>
        <Land />
      </>
    );
  }
}
