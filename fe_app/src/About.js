import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function About()
{
    return (
        <div className="content">
            <p>About us</p>
            <Link to="/">
                Go back
            </Link>
        </div>
    )
} 