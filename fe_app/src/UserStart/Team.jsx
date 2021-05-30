import React, { useEffect,useState } from 'react'
import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

export default function Team(){

    const {teamid} = useParams();
    const {leader} = useParams();
    const [team,setTeam] = useState([]);
    const [flows,setFlows] = useState([]);
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
        setFlows(data.flows);
    }
    
    useEffect(() => {
        getTeam();
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

        if(response.ok)
        {
            console.log("OK");
        }
        else
        {
            console.log("ERROR");
        }
    }


    const removeFlow = async(flowid) => {
        const requestOptions = {
            method: 'DELETE',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({"flow":flowid})
        };

        const response = await fetch("http://localhost:8000/easy_flow/v1/flow_remove/",requestOptions);
        
        console.log(response);    
        getTeam();
    }


    return(
        <div className="contentBody" id="Info">
            <div>
                <h2>Team info</h2>
                <p>Name: {team?.name}</p>
                <h2>Members</h2>
                <ul>
                {team?.members?.map(member => (
                    <li key={member.username}>{member.username}</li>
                  ))}
                </ul>
                <br/>
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
                <h2>Flows created by this team:</h2>
                <table className="flowsTable">
                    <thead>
                        <tr>
                            <th>Flow name</th>
                            <th>Created:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flows?.map(flow=>(
                            <tr key={flow.name}>
                                <td>
                                    <Link to={`/flow/${teamid}/${flow.id}/${flow.name}/${flow.root.id}`}>
                                        {flow.name}
                                    </Link>
                                </td>
                                <td>
                                    {flow.timestamp.slice(0,10)+"   "+flow.timestamp.slice(11,19)}
                                </td>
                                <td>
                                    <button id="delete" onClick={() => removeFlow(flow.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br/>
                <br/>

                <Link type="button" to={`/flow/${teamid}/create`}>
                    Create new flow
                </Link>
                
            </div>
        </div>
    )
}