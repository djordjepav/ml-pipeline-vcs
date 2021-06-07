import React from 'react';
import Header from "./Header.jsx";
import "./Main.css";

export default function Main({children})
{
    return(
        <div>
            <Header />
            <main class="main">
                {children}
            </main>
        </div>
    );
}