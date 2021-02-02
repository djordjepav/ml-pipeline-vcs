import React, { useEffect,useState } from 'react';
import { useCookies } from 'react-cookie';

export default function TeamCreate({user}){

    const [teamname, setTeamname] = useState("");
    const [cookies] = useCookies(['user']);

    const updateTeamname = e => {
        setTeamname(e.target.value);
    }

    const createTeam = async(e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({"created_by":cookies.id,"name":teamname})
        };

        const response = await fetch("http://localhost:8000/easy_flow/v1/team_create/",requestOptions);
        const data = await response.json();
        console.log(data);

        if(response.ok)
        {
            console.log("OK");
            console.log(data);
        }
        else
        {
            console.log("ERROR");
        }
    }

    return(
        <div className="contentBody">
            
        <form onSubmit={createTeam}>
            Team name: <input className="inputSignup" type="text" value={teamname} onChange={updateTeamname} />
            <br /><br />
            <button type="submit" id="buttonSingup">Create team</button>
        </form>
    </div>
    )
}
