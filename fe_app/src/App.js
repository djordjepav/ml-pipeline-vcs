//import './App.css';
import Home from "./Home.js";
import Start from "./Start.js";
import About from "./About.js";
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path="/about" component={About}/>
          <Route path="/getStarted" component={Start}/>
        </Switch>
      </Router>
    </div>
  );
}