import React, { useEffect,useState } from 'react';
import './Flow.css';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

export default function ExeWindow({current}){

    const {teamid} = useParams();
    const {flowid} = useParams();
    const {rootid} = useParams();

    const [cookies] = useCookies(['user']);

    const [user,setUser] = useState({});
    const [flow,setFlow] = useState(undefined);
    const [team,setTeam] = useState(undefined);
    const [servers,setServers] = useState([]);
    const [requests, setRequests] = useState([]);

    const [permissions, setPermissions] = useState(0);

    const [selectedServer, setSelectedServer] = useState('');
    const [fromDate, setFromDate] = useState(undefined);
    const [toDate, setToDate] = useState(undefined)


    useEffect(() => {
        getUser();
    },[flowid]);
   
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
    }

    useEffect(() => {
        if(user.sent_requests != undefined){
            getRequests();
        }
    },[user.sent_requests] );

    const getRequests = () => {
        let temp = user.sent_requests.filter(req => req.version.id === current);

        if(temp != undefined){
            setRequests(temp);
        }
        else{
            setRequests([]);
        }
            
    }




    
    useEffect(() => { 
        getTeam();
    },[teamid] );

    const getTeam = async () => {
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
        if(team != undefined)
            getPermissions();
    },[team] );    
    

    const getPermissions = () => {

        if(team.leader != undefined) {
            let temp = team.leader.id;
            if(temp == cookies.id) {
                setPermissions(1);
            }
        }
    }





    
    useEffect(() => {
        getFlow();
    },[flowid])

    const getFlow = async () => {
        const requestOptions = {
            method: 'GET',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
            };
        const response = await fetch("http://localhost:8000/easy_flow/v1/flow/" + flowid +"/", requestOptions);
        const data = await response.json();

        setFlow(data);
    }

    useEffect(() => {
        if(flow != undefined){
            getServers();
        }
    },[flow] );

    const getServers = () => {  
        let temp = flow.computational_servers;
        setServers(temp);
    }


    

   

   


    const sendReq = async () => {
        var request = {
            "created_by": cookies.id,
            "flow_version": current,
            "comp_server" : selectedServer,
	        "from_date" : fromDate,
            "to_date": toDate
        }


        const requestOptions = {
            method: 'POST',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(request)
        };

        const response = await fetch("http://localhost:8000/easy_flow/v1/request_create/",requestOptions);
        const data = await response.json();
    }

    return(
        <div>
            <h1>Execution</h1>
            <button disabled={!permissions}>Execute</button>
            <button disabled={permissions} onClick={() => sendReq()}>Request</button>
            <div>
                From: <input type="date" disabled={permissions} value={fromDate} onChange={(e) => setFromDate(e.target.value)}></input>
                To: <input type="date" disabled={permissions} value={toDate} onChange={(e) => setToDate(e.target.value)}></input>
            </div>
            {/* <select id="servers" value={servers} onChange={e => setServers(e.currentTarget.value)}>
                {servers?.map(server => (
                <option key={server.id} value={server.id}>{server.env_path}</option>
                ))}
            </select> */}
            <div>
                {servers?.map(server => (
                    <div className = "radio">
                        <input
                            type="radio" 
                            value={server.id} 
                            checked={selectedServer === server.id}
                            onChange={() => setSelectedServer(server.id)}
                        />
                        {server.env_path}
                    </div>
                ))}
            </div>
            <div>
                {requests.map((req,index) => (
                    <div>
                        Request {index+1} from {req.from_date.substring(0, 10)} to {req.to_date.substring(0, 10)}
                    </div>
                ))}
            </div>
        </div>
            

    )
}


