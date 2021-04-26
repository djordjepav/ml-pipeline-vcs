import React, { useEffect,useState } from 'react';
import './Flow.css';
import { useCookies } from 'react-cookie';

export default function ExeWindow(){

    return(
        <div className="exewind">
            <h1>Execution</h1>
            <button>Execute</button>
            <button>Request</button>
            <div>
                Od: <input type="date"></input>
                Do: <input type="date"></input>
            </div>     
        </div>
    )
}


