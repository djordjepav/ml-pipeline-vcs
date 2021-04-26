import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function About({location})
{
    const { state = {} } = location;
    const { modal } = state;

    return (
        <div className="content">
            <p>About us</p>
            {modal}
            <Link to="/">
                Go back
            </Link>
        </div>
    )
} 