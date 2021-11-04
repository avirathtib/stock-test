import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Details from "./Details";
import Home from "./Home";

export default function App() {
  return (
    <Router>
          <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:id">
            <Details />
          </Route>
        </Switch>
        </Router>
  )}



