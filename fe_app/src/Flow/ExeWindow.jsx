import React, { useEffect,useState } from 'react';
import './Flow.css';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import io from "socket.io-client";

export default function ExeWindow({current,setLog,log}){

    const {teamid} = useParams();
    const {flowid} = useParams();

    const [cookies] = useCookies(['user']);

    const [user,setUser] = useState({});
    const [flow,setFlow] = useState(undefined);
    const [team,setTeam] = useState(undefined);
    const [servers,setServers] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    const [permissions, setPermissions] = useState(0);
    const [approved, setApproved] = useState(0);
    const [reqest, setReqest] = useState(null);

    const [selectedServer, setSelectedServer] = useState(null);
    const [fromDate, setFromDate] = useState(undefined);
    const [toDate, setToDate] = useState(undefined);

    const [socket, setSocket] = useState(null);
    //const [log,setLog] = useState([]);

    const [exeResponse, setExeResponse] = useState("");


    useEffect(() => {

        const socket = io("http://localhost:8080");
        setSocket(socket);
        subscribe();
        getUser();
    },[]);


    const subscribe = async () => {
        let bodyData = "flowId=" + flowid;

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: bodyData,
        };

        const response = await fetch("http://localhost:8080/subscribe", requestOptions);
        const data = await response.json();

        if (data.status == "OK") {
            
        }
        else {
            console.log("Get chatters error");
        }
    }

    useEffect(() => {
        if (socket != null) {
                
            socket.on('log',data=>{
                setLog(log => [...log,data]);
            });
        }
    }, [socket])
    
   
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

        setSentRequests([]);
        setReceivedRequests([]);

        // console.log(data);

        for(let i=0;i<data.sent_requests.length;i++){
            let req = data.sent_requests[i];
            if(req.version.id == current){

                var nowDate = new Date().toJSON().slice(0,10);
                var reqDate = req.to_date.slice(0,10);

                if( req.approved == true && reqDate >= nowDate) {
                    setApproved(1);
                    setPermissions(1);
                    setReqest(req.id);
                }
                setSentRequests(sentRequests => [...sentRequests,req]);
            }
                
        }
        for(let i=0;i<data.received_requests.length;i++){
            let req = data.received_requests[i];
            if(req.version.id == current){
                setReceivedRequests(receivedRequests => [...receivedRequests,req]);
            }
                
        }
        setUser(data);
    }

    // useEffect(() => {
    //     if(user.sent_requests != undefined){
    //         console.log(user.sent_requests[0].version.id);
    //         console.log(current);
    //         getSentRequests(user.sent_requests);
    //     }
    // },[user.sent_requests] );


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

    const execute = async () => {

        var body = {
            "created_by": cookies.id,
            "flow_version": current,
            "comp_server": selectedServer,
            "request": reqest
        }

        const requestOptions = {
            method: 'PUT',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(body)
        };

        setExeResponse("Whait for server response");

        const response = await fetch("http://localhost:8000/easy_flow/v1/flow_version_execute/",requestOptions);
        const data = await response.json();
        console.log(data);

        if(data.detail = "success"){
            setExeResponse("Flow executed successfully ");
        }
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

    const aprove = async (id) => {
        var request = {
            "created_by": cookies.id,
            "request": id,
            "approve": true
        }

        const requestOptions = {
                method: 'PUT',
                headers:{
                    'Authorization': 'Token ' + cookies.token,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(request)
            };

            const response = await fetch("http://localhost:8000/easy_flow/v1/request_approve/",requestOptions);
            const data = await response.json();

            console.log(data);
    
    }

    return(
        <div class="exewindow">
            <p class="exetitle">Execution</p>
            <button disabled={!permissions || selectedServer === null} onClick={() => execute()}>Execute</button>
            <button disabled={permissions} onClick={() => sendReq()}>Request</button>
            <div>
                <p>From: <input type="date" disabled={permissions} value={fromDate} onChange={(e) => setFromDate(e.target.value)}></input> </p>
                <p>To: <input type="date" disabled={permissions} value={toDate} onChange={(e) => setToDate(e.target.value)}></input> </p>
            </div>
            <div class="compservers">
                <p>Computational servers:</p>
                {servers?.map(server => (
                    <div className = "radio">
                        <p><input
                            type="radio" 
                            value={server.id} 
                            checked={selectedServer === server.id}
                            onChange={() => setSelectedServer(server.id)}
                        />
                        {server.remote_host} ({server.env_path})</p>
                    </div>
                ))}
            </div>

            <div className="requests">
                {approved == 1 && 
                    <p>
                        You can execute flow
                    </p>
                }
                
                {/* {sentRequests?.map((req,index) => (
                    <div>
                        <p>Request {index+1} from {req.from_date.substring(0, 10)} to {req.to_date.substring(0, 10)} { }
                            {req.approve == true ? 
                                <>
                                    aprooved
                                </>
                                :<>
                                    not aprooved
                                </>
                            }
                        </p>
                    </div>
                ))} */}
                {receivedRequests?.map((req,index) => (
                    <div>
                        <p>Request {index+1} from {req.from_date.substring(0, 10)} to {req.to_date.substring(0, 10)}</p>
                        <button onClick={() => aprove(req.id)}>Aprove</button>
                    </div>
                ))}
            </div>

            <div>
                <p>{exeResponse}</p>
                {/* <textarea value={log} readOnly={true}></textarea> */}
            </div>
        </div>
            

    )
}


