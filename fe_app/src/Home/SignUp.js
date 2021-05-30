import React, { useEffect,useState } from 'react'
import { useCookies } from 'react-cookie';
import {useHistory} from "react-router-dom";
import { useToasts } from 'react-toast-notifications'

export default function SingUp() {

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies(['user']);

    const history = useHistory();
    const { addToast } = useToasts()

    const updateFirstname = e => {
        setFirstname(e.target.value);
    }
    const updateLastname = e => {
        setLastname(e.target.value);
    }
    const updateUsername = e => {
        setUsername(e.target.value);
    }
    const updateEmail = e => {
        setEmail(e.target.value);
    }
    const updatePassword = e => {
        setPassword(e.target.value);
    }

    const createUser = async(e) =>{
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({"username":username,"email":email,"password":password,"first_name":firstname,"last_name":lastname})};
            
        const response = await fetch('http://localhost:8000/easy_flow/v1/user_create/',requestOptions);
        const data = await response.json();

        if(response.ok)
        {
            setCookies("token",data.token);
            setCookies("id",data.user.id);
            console.log("OK");
            console.log(data);

            addToast("Successful registration", {
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

    return (
        <div className="divSignup">
            <form onSubmit={createUser}>
                Username: <input className="inputSignup" type="text" value={username} onChange={updateUsername} />
                <br /><br />
                E-mail: <input className="inputSignup" type="text" value={email} onChange={updateEmail} />
                <br /><br />
                Fistname: <input className="inputSignup" type="text" value={firstname} onChange={updateFirstname} />
                <br /><br />
                Lastname: <input className="inputSignup" type="text" value={lastname} onChange={updateLastname} />
                <br /><br />
                Password: <input className="inputSignup" type="text" value={password} onChange={updatePassword} />
                <br /><br />
                <button type="submit" id="buttonSingup">SignUp</button>
            </form>
        </div>
    )
}