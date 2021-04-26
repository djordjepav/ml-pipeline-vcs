
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import LogIn from './LogIn';
import SingUp from './SignUp';

export default function Home() 
{

  const [isLog, setIsLog] = useState(true); 

  const handlerRegister = () =>
  {
    setIsLog(false);
  }

  const handlerLogIn = () =>
  {
    setIsLog(true)
  }
  
    return (
      <div className="content">
        <div className="title">
          <h1>Welcome to EasyFlow</h1>
          <p className="about">
            We are framework designed for...
            {/* <Link className="linkToAbout" to = "/about"> About</Link> */}
            <Link className="linkToAbout" 
            to ={{
              pathname:"/about",
              state: {modal: "true"},
            }}>
              About
            </Link>
            <br/>
            i tako dalje
          </p>
        </div>
        <div className="signDiv">
          <Link onClick={handlerRegister}> Register </Link>
          /
          <Link onClick={handlerLogIn}> LogIn </Link>
          <br/>
          {isLog == true ?
            <LogIn></LogIn>
            :<SingUp></SingUp>
          }
          <br/>
        </div>
      </div>
    );
  }