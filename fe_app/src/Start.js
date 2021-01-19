import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from "./Header.jsx";
import UserProfil from './UserProfil';


export default function Start()
{
    return(
        <div>
            Zdravo zivo
            <Router>
                <Header />
                Vozdra
                <main>
                    <Switch>
                        <Route path="/getStarted/" component={UserProfil}/>
                        
                    </Switch>
                </main>
            </Router>
        </div>
    );
}