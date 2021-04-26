import React from 'react';
import Header from "./Header.jsx";

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