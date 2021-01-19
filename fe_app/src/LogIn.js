import React, { useEffect,useState } from 'react'
import { useCookies } from 'react-cookie';
import {useHistory} from "react-router-dom";

export default function LogIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const [cookie, setCookie] = useCookies(['user']);
    const history = useHistory();

    const updateUsername = e => {
        setUsername(e.target.value);
    }
    const updatePassword = e => {
        setPassword(e.target.value);
    }


    async function LogIn(){

        //console.log(JSON.stringify({"username":username,"password":password}));
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"username":username,"password":password})
        };

        setIsError(false);
        try{
            const response = await fetch('http://localhost:8000/easy_flow/v1/login/',requestOptions);
            const data = await response.json();
            setCookie("token",data.token);
            console.log("OK");
            history.push("/getStarted");
        }
        catch(error){
            setIsError(true);
            console.error(error);
        }
        
    }

    return(
        <div className="divSignup">
            { isError && <div> Incorect username or password </div> }
            Username: <input className="inputSignup" type="text" value={username} onChange={updateUsername}/>
            <br/><br/>
            Password: <input className="inputSignup" type="text" value={password} onChange={updatePassword}/>
            <br/><br/>
            <button id="buttonSingup" onClick={LogIn}>LogIn</button>
            <br/><br/>
        </div>
    )
}