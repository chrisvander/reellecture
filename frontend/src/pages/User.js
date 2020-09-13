import React, { useState, useEffect } from 'react';
import { 
  Container,
  Button
} from 'react-bootstrap';
import Nav from './nav';


function User() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    name: '',
    role: ''
  });

  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(res => {
        setUserInfo({ username: res.username, name: res.name, role: res.role });
      });
  }, []);

  return (
    <>
      <Nav />
      <Container><br />
        <h1>Hello, {userInfo.name}!</h1>
        {userInfo.role === 'instructor' && (
            <>
              Session Name: <input type="text" onChange={e => setSessionName(e.target.value)} /><br /><br />
              <a href={`/video/${sessionName.replace(/[^A-Z0-9]/ig, "_")}`}><Button>Create Session</Button></a>
            </>
          )
        }
        {userInfo.role === 'student' && (
            <>
              Session Name: <input type="text" onChange={e => setSessionName(e.target.value)} /><br /><br />
              <a href={`/video/${sessionName.replace(/[^A-Z0-9]/ig, "_")}`}><Button>Join Session</Button></a>
            </>
          )
        }
      </Container>
    </>
  )
}

export default User;



