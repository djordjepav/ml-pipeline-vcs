import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {useHistory} from "react-router-dom";
import "./Header.css";

export default function Header()
{
    const [cookies, removeCookies] = useCookies(['user']);
    const history = useHistory();

    const logout = async () => {
        console.log(`Token ${cookies.token}`);
        /*
        const requestOptions = {
            method: 'PUT',
            header: new Headers({
                   'Authorization': `Token ${cookies.token}`
                })
            };
            

        const requestOptions = {
        method: 'PUT',
        header:{
                'Authorization': `Token ${cookies.token}`
           },
        body: JSON.stringify({'id':cookie.id})  
        };*/
        const requestOptions = {
            method: 'PUT',
            headers:{
                    'Authorization': `Token ${cookies.token}`,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
            body: JSON.stringify({"created_by":cookies.id})  
        };
        console.log(requestOptions);
        const response = await fetch("http://localhost:8000/easy_flow/v1/logout/",requestOptions);
        console.log(response);

        console.log("Logout");
        removeCookies("token");
        removeCookies("id");
        history.push("/");
    }

    return(
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/main">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/main/teamCreate">
                            Create new team
                        </Link>
                    </li>
                    <li>
                            Teams
                    </li>

                    <li id="logout">
                        <a onClick={logout}>Logout</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}