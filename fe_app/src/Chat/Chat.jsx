import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import socketIOClient from "socket.io-client";
import io from "socket.io-client";

export default function Chat() {

    const [response, setResponse] = useState("");

    const [firstname, setFirstname] = useState("DAvid");

    const [socket, setSocket] = useState(null);

    useEffect(() => {

        setSocket(io('http://localhost:3001/chat'));
    }, []);

    useEffect(() => {
        console.log(socket);

        if(socket != null)
        {
            socket.on('msgToClient', (message) => {
                //console.log(message);
            });

            socket.on('joinRoom', (message) => {
                console.log(message);
            });
        }


    },[socket])


    const sendMassage = () => {

        const message = {
            name: firstname,
            text: "dskfjklads",
            room: "roomA"
        };

        console.log(message);

        socket.emit('msgToServer', message);
    }

    const joinRoom = () => {
        socket.emit('joinRoom', 'roomA');
    }

    const changeName = (e) => {
        setFirstname(e.target.value);
    }

    return (
        <div>
            <h2>Chat</h2>
            <p>{response}</p>
            <input type="text" value={firstname} onChange={(e) => changeName(e)}></input>
            <p>{socket?.connected}</p>
            <button onClick={joinRoom}>Join room</button>
            <button onClick={sendMassage}>Send</button>
        </div>
    )
}