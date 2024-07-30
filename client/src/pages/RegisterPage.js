import { useState } from "react";
import {Navigate} from 'react-router-dom'

export default function RegisterPage()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    function handleReload(e)
    {
        e.preventDefault();
    }

    async function register(e)
    {
        e.preventDefault();
        const response = await fetch('https://mern-blog-backend-8x0q.onrender.com/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        console.log(response);

        if(response.status !== 200)
        {
            alert('Registration failed');
        }
        else
        {
            console.log('Registration successfull')
            setRedirect(true);
        }
    }

    if(redirect)
    {
        return <Navigate to={`/login`} />
    }

    return(
        <form className="register" onSubmit={handleReload}>
            <h1>Register</h1>

            <input type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
            
            <input type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

            <button type="submit"
            onClick={register}>Register</button>
        </form>
    );
}