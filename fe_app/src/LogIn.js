import React, { useState } from 'react'

export default function LogIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const updateUsername = e => {
        setUsername(e.target.value);
    }
    const updatePassword = e => {
        setPassword(e.target.value);
    }

    return(
        <div className="divSignup">
            Username: <input className="inputSignup" type="text" value={username} onChange={updateUsername}/>
            <br/><br/>
            Password: <input className="inputSignup" type="text" value={password} onChange={updatePassword}/>
            <br/><br/>
            <button id="buttonSingup">LogIn</button>
            <br/><br/>
        </div>
    )

}