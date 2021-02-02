import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from "./Header.jsx";
import UserProfil from './UserProfil';
import Start from './Start';
import About from "./About";


export default function Main({children})
{
    return(
        <div>
            <Header />
            <main>
                {children}
            </main>
        </div>
    );
}