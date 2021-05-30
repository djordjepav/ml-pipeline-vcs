import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import {useHistory} from "react-router-dom";
import { useToasts } from 'react-toast-notifications'


export default function LogIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies(['user']);

    const history = useHistory();
    const { addToast } = useToasts()

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

        const response = await fetch('http://localhost:8000/easy_flow/v1/login/',requestOptions);
        const data = await response.json();

        if(response.ok)
        {
            setCookies("token",data.token);
            setCookies("id",data.user.id);
            console.log("OK");
            console.log(data);

            addToast("Successful login", {
                appearance: 'success',
                autoDismiss: true,
            })

            history.push("/main");
        }
        else{
            //removeCookie("token");
            setIsError(true);
            console.log("ERROR");
        }
        
    }

    return(
        <div className="divSignup">
            { isError && <div> Incorect username or password </div> }
            <br/>
            Username: <input className="inputSignup" type="text" value={username} onChange={updateUsername}/>
            <br/><br/>
            Password: <input className="inputSignup" type="text" value={password} onChange={updatePassword}/>
            <br/><br/>
            <button id="buttonSingup" onClick={LogIn}>LogIn</button>
            <br/><br/>
        </div>
    )
}