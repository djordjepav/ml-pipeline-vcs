import React, { useEffect,useReducer,useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './Start.css'

export default function UserProfil({user}){
    
    const [cookies] = useCookies(['user']);

    useEffect(() => {
        //getUser();
    },[] );


    return (
        <div className="contentBody" id="Info">
            <table className="InfoTable">
                <h2>Profile info</h2>
                    <tr>
                        <th>
                            Username:
                        </th>
                        <td>
                            {user?.username}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Email:
                        </th>
                        <td>
                            {user?.email}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Firstname:
                        </th>
                        <td>
                            {user?.first_name}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Lastname:
                        </th>
                        <td>
                            {user?.last_name}
                        </td>
                    </tr>
            </table>
        </div>
    )
}