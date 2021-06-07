import React, { useEffect, useState } from 'react';
import './Chat.css';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import socketIOClient from "socket.io-client";
import io from "socket.io-client";

export default function Chat() {

    const [cookies] = useCookies(['user']);
    const { flowid } = useParams();

    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("Poruka");

    const [chatters, setChatters] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        const socket = io("http://localhost:8080");
        setSocket(socket);

        setUsername(cookies.username);
        getChatters();
        getMessages();
    }, []);

    useEffect(() => {
        if (socket != null) {
            socket.on('new_chatters', data => {
                console.log(data);
            });

            socket.on('receive', data => {
                console.log(data);

                //setMessages(messages => [...messages, data]);

            });
        }
    }, [socket])


    const getChatters = async () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        };

        const response = await fetch("http://localhost:8080/get_chatters?flowId=" + flowid, requestOptions);
        const data = await response.json();
        console.log(data);
        setChatters(data);
        //setCount(data.length);
    }

    const getMessages = async () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        };

        const response = await fetch("http://localhost:8080/get_messages?flowId=" + flowid, requestOptions);
        console.log(response);
        const data = await response.json();
        console.log(data);
        setMessages(data);
    }


    const joinRoom = async () => {

        let bodyData = "username=" + username + "&flowId=" + flowid;

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: bodyData,
        };

        const response = await fetch("http://localhost:8080/join", requestOptions);
        const data = await response.json();
        console.log(data);

        if (data.status == "OK") {
            socket.emit('join_chatter', username);
        }
        else {
            console.log("Join error");
        }
    }

    const sendMassage = async () => {

        let messageData = "username=" + username + "&message=" + message + "&flowId=" + flowid;

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: messageData,
        };

        const response = await fetch("http://localhost:8080/send_message", requestOptions);
        const data = await response.json();
        console.log(data);

        if (data.status == "OK") {
            socket.emit('message', data.message);
        }

        // socket.emit('msgToServer', message);
    }


    return (
        <div>
            <div class="header">
                <p class="chatFont">Chat</p>
                <button class="joinButton" onClick={joinRoom}>Join chat</button>
            </div>

            <div className="chatWindow">
                <div className="chatters">
                    <p class="chatFont">Active</p>
                    <hr />
                    {chatters.filter(chatter => chatter != username).map(chatter => (
                        <div>
                            {chatter}
                        </div>
                    ))}
                </div>
                <div className="chat">
                    <div>
                    <p class="chatFont">Messages</p>
                    <hr />
                    </div>
                    {messages.map(message => (
                        <div>
                            {message.sender}: {message.message}
                        </div>
                    ))}
                    <div className="messageInputBox">
                        <input class="messageInput" type="text" value={message}
                            onChange={(e) => setMessage(e.target.value)}>
                        </input>
                        <button class="messageSendButton" onClick={sendMassage}>Send</button>
                    </div>
                </div>

            </div>

        </div>
    )
}