import React, { useContext, createContext, useMemo, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Details from "./Details";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Profile";

export const TickerContext = createContext();
export const UserContext = createContext();

export default function App() {
  const [ticker, setTicker] = useState("");
  const [email, setEmail] = useState("");
  return (
    <TickerContext.Provider value={{ ticker, setTicker }}>
      <UserContext.Provider value={{ email, setEmail }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/profile" component={Profile}></Route>
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/:id">
                <Details />
              </Route>
            </Switch>
          </AuthProvider>
        </Router>
      </UserContext.Provider>
    </TickerContext.Provider>
  );
}
