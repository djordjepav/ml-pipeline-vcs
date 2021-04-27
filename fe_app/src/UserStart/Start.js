import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import './Start.css'
import { useCookies } from 'react-cookie';

export default function Start({children}){

    const [cookies] = useCookies(['user']);
    const [user,setUser] = useState([]);
    const [teams,setTeams] = useState([]);
    const [myTeams, setMyTeams] = useState([]);

    useEffect(() => {
        getUser();
    },[] );

    const getUser = async () =>
    {
        const requestOptions = {
            method: 'GET',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
            };
        const response = await fetch("http://localhost:8000/easy_flow/v1/user/" + cookies.id +"/", requestOptions);
        const data = await response.json();

        setUser(data);
        setTeams(data.teams);
        setMyTeams(data.created_teams);
    }

    return (
        <div className="content" id="start">
            <aside id="teams">
                <nav>
                    <ul>
                        <p>
                            <Link to="/main/teamCreate">
                                Create new team
                            </Link>
                        </p>
                        Your teams
                        {myTeams?.map(team => (
                            <li key={team.name}>
                                <Link to={`/main/team/${team.id}/${1}`}>
                                    {team.name}
                                </Link>
                            </li>
                        ))}
                        <br/>
                        You are member
                        {teams?.map(team => (
                            <li key={team.name}>
                                <Link to={`/main/team/${team.id}/${0}`}>
                                    {team.leader.username}/{team.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main>
                {children(user)}
            </main>
        </div>
    )
}