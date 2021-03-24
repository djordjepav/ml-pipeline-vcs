//import './App.css';
import Home from "./Home.js";
import Main from "./Main.jsx";
import About from "./About.js";
import React from 'react';
import Start from './Start';
import UserProfil from './UserProfil';
import TeamCreate from './TeamCreate';
import Team from './Team';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainLayout from "./Layout.jsx";
import Flow from './Flow';

export default function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path="/about" component={About}/>
          
          <Main>
              <Route path="/main">
                <Start>
                { user =>(
                <React.Fragment> 
                  <Route exact={true} path="/main">
                    <UserProfil user={user}/>
                  </Route>
                  <Route path="/main/teamCreate">
                    <TeamCreate user={user}/>
                  </Route>
                  <Route path="/main/team/:teamid/:leader" forceRefresh={true}>
                    <Team/>
                  </Route>
                </React.Fragment>
                )}
                </Start>
              </Route>
              <Route path="/flow/:flowname/:rootid" component={Flow}/>      
          </Main>
        </Switch>
      </Router>
    </div>
  );
}