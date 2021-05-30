import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';  
import { useParams } from "react-router-dom";

import './Flow.css';
import FlowCreate from './FlowCreate';
import Flow from './Flow';

export default function FlowContainer({children}){

    const [cookies] = useCookies(['user']);
    const {teamid} = useParams();

    const [team,setTeam] = useState([]);
    const [flows,setFlows] = useState([]);

    useEffect(() => {
        getTeam();
    },[] );

    const getTeam = async () =>
    {
        const requestOptions = {
            method: 'GET',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
            };
        const response = await fetch("http://localhost:8000/easy_flow/v1/team/" + teamid +"/", requestOptions);
        const data = await response.json();
        setTeam(data);
        setFlows(data.flows);
    }


    return(
        <div className="content" id="flow">
            <aside id="side">
                <nav>
                    Flows list
                    <ul>
                        {flows?.map(flow =>(
                            <li key={flow.name}>
                                <Link to={`/flow/${teamid}/${flow.id}/${flow.name}/${flow.root.id}`} >
                                    {flow.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Link to={`/flow/${teamid}/create`}>Create flow</Link>
                <br/>
            </aside>
            <main>
                {children}
            </main>
        </div>
    )
}