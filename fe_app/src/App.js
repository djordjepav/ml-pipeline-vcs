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

export default function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path="/about" component={About}/>
          <Main>
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
          </Main>
               {/*<Route path="/main/flowManager" component={FlowManager}/>
               <Route paht="/main/flowVersion" component={FlowVersion}/> */}
        </Switch>
      </Router>
    </div>
  );
}