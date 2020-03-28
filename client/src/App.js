import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Landingpage from "./pages/landingpage/landingpage";

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="*" component={Landingpage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
