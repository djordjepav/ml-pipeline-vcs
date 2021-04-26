//import './App.css';
import Home from "./Home/Home.jsx";
import Main from "./Main/Main.jsx";
import About from "./Home/About.jsx";
import UserProfil from "./UserStart/UserProfil.jsx";
import Start from "./UserStart/Start.js";
import Team from "./UserStart/Team.jsx";
import TeamCreate from "./UserStart/TeamCreate.jsx";
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Flow from "./Flow/Flow.jsx";
import FlowVersionCreate from "./Flow/FlowVersionCreate.jsx";
import FlowContainer from "./Flow/FlowContainer.jsx";
import FlowCreate from "./Flow/FlowCreate.jsx";

export default function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path="/about" component={About} />

          <Main>

            <Route path="/main">
              <Start>

                {user => (
                  <React.Fragment>

                    <Route exact={true} path="/main">
                      <UserProfil user={user} />
                    </Route>

                    <Route path="/main/teamCreate">
                      <TeamCreate user={user} />
                    </Route>

                    <Route path="/main/team/:teamid/:leader" forceRefresh={true}>
                      <Team />
                    </Route>

                  </React.Fragment>
                )}

              </Start>
            </Route>

            <Route path="/flow/:teamid">
              <FlowContainer>

                <React.Fragment>

                  <Route path="/flow/:teamid/:flowname/:rootid/:prev/create/">
                    <FlowVersionCreate />
                  </Route>

                  <Route exact={true} path="/flow/:teamid/:flowname/:rootid" forceRefresh={true} component={Flow}>
                  </Route>

                  <Route exact={true} path="/flow/:teamid/create">
                    <FlowCreate />
                  </Route>



                </React.Fragment>

              </FlowContainer>
            </Route>

            <Route />


          </Main>
        </Switch>
      </Router>
    </div>
  );
}