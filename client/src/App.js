import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import NoMatch from "./components/pages/NoMatch";
import logo from "./logo.svg";
import "./App.css";
// import AiChat from "./components/AiChat/AiChat";
// import Layout1 from "./components/pages/Layout1";
// import Layout2 from "./components/pages/Layout2";
// import LayoutA from "./components/pages/LayoutA";
import SocketLayout from "./components/pages/SocketLayout";

function App() {
  // const [authenticated, setAuthenticated] = useState(false);

  // const authenticate = () => {
  //   setAuthenticated(true);
  // };

  // const deAuthenticate = () => {
  //   setAuthenticated(false);
  // };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path={["/", "/home"]}>
            {/* <AiChat key={"1"} /> */}
            {/* <LayoutA key={"A"} /> */}
            <SocketLayout key={"A"} />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
