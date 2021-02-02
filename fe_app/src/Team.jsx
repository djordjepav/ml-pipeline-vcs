import React, { isValidElement, useEffect,useState } from 'react'
import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function TeamCreate(){

    const {teamid} = useParams();
    const {leader} = useParams();
    const [team,setTeam] = useState([]);
    const [cookies] = useCookies(['user']);

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
    }
    
    useEffect(() => {
        getTeam();
        console.log(leader);
        console.log(team);
    },[teamid] );


    const [username, setUsername] = useState("");

    const updateUsername = e => {
        setUsername(e.target.value);
    }


    const addMember = async(e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({"created_by":cookies.id,"user":username,"team":teamid})
        };

        const response = await fetch("http://localhost:8000/easy_flow/v1/add_member/",requestOptions);
        const data = await response.json();
        console.log(data);

        if(response.ok)
        {
            console.log("OK");
        }
        else
        {
            console.log("ERROR");
        }
    }

    return(
        <div className="contentBody" id="Info">
            <div>
                <h2>Team info</h2>
                <p>Name: {team?.name}</p>
                <h2>Members</h2>
                <ul>
                {team?.members?.map(member => (
                    <li>{member.username}</li>
                  ))}
                </ul>

                {leader}

                {leader == true &&
                <div>
                <p>Add member:</p>
                <form onSubmit={addMember}>
                    User email: 
                    <input className="inputSignup" type="text" value={username} onChange={updateUsername} />
                    <br /><br />
                    <button type="submit" id="buttonSingup">Add member</button>
                </form>
                </div>}
            </div>
            
            <div className="flows">
                    
            </div>
        </div>
    )
}