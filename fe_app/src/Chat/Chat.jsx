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
    const [message, setMessage] = useState("");

    const [chatters, setChatters] = useState([]);
    const [messages, setMessages] = useState([]);

    const [active, setActive] = useState(false);

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
                setChatters(chatters => [...chatters, data]);
            });

            socket.on('delete_chatter', data => {
                console.log(data);
                setChatters(data);
            })

            socket.on('receive', data => {
                setMessages(messages => [...messages, data]);
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

        const response = await fetch("http://localhost:8080/get_chatters?flowId=" + flowid + "&username=" + cookies.username, requestOptions);
        const data = await response.json();
        console.log(data);

        if (data.status == "OK") {
            setChatters(data.chatters);
            setActive(data.active);
        }
        else {
            console.log("Get chatters error");
        }
    }

    const getMessages = async () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        };

        const response = await fetch("http://localhost:8080/get_messages?flowId=" + flowid, requestOptions);
        const data = await response.json();
        console.log(data);
        setMessages(data);
    }

    // const getStatus = async () => {
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //         }
    //     };

    // }


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
            setActive(1);

            socket.emit('join_chatter', username);
        }
        else {
            console.log("Join error");
        }
    }

    const leaveRoom = async () => {
        let bodyData = "username=" + username + "&flowId=" + flowid;

        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: bodyData,
        };

        const response = await fetch("http://localhost:8080/leave", requestOptions);
        const data = await response.json();
        console.log(data);

        if (data.status == "OK") {

            setActive(0);

            var c = chatters;
            console.log(c);
            console.log(c.indexOf(username));
            c.splice(c.indexOf(username), 1);
            socket.emit('leave_chatter', c);
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

        if (data.status == "OK") {
            socket.emit('message', data.message);
        }

        // socket.emit('msgToServer', message);
    }


    return (
        <div>
            <div class="header">
                <p class="chatFont">Chat</p>
                {active == false ?
                    <button class="joinButton" onClick={joinRoom}>Join chat</button>
                    : <button class="joinButton" onClick={leaveRoom}>Leave chat</button>
                }
            </div>

            <div className="chatWindow">
                <div className="chattersdiv">
                    <p class="chatFont">Active</p>
                    <hr />
                    {active == true ?
                        <>
                            {chatters.filter(chatter => chatter != username).map(chatter => (
                                <div className="chatters">
                                    <ul>
                                        <li><p>{chatter}</p></li>
                                    </ul>

                                </div>
                            ))}
                        </>
                        :
                        <div>
                            <p>Join chat to see active users</p>
                        </div>
                    }
                </div>
                {active == true ?
                    <div className="chat">
                        <div>
                            <p class="chatFont">Messages</p>
                            <hr />
                        </div>
                        <div className="messages">
                            {messages.map(message => (
                                <>
                                    {message.sender == username ?
                                        <div className="message myMessage"><p>You: {message.message}</p></div>
                                        :
                                        <div className="message fromMessage"><p>{message.sender}: {message.message}</p></div>
                                    }

                                </>
                            ))}
                        </div>
                        <div className="messageInputBox">
                            <input class="messageInput" type="text" value={message}
                                onChange={(e) => setMessage(e.target.value)}>
                            </input>
                            <button class="messageSendButton" onClick={sendMassage}>Send</button>
                        </div>
                    </div>
                    :
                    <div className="emptyChat">
                        <div>
                            <p class="chatFont">Messages</p>
                            <hr />
                        </div>
                        <p>Join chat to see messages</p>
                    </div>
                }

            </div>

        </div>
    )
}