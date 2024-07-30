import { useState, useContext } from "react";
import {Navigate} from 'react-router-dom'
import { UserContext } from "../UserContext";
export default function LoginPage()
{
    const {setUserInfo, userInfo} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    function handleReload(e)
    {
        e.preventDefault();
    }

    async function handleLogin(e)
    {
        e.preventDefault();
        const response = await fetch('https://mern-blog-backend-8x0q.onrender.com/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
            credentials: 'include'//to save cookies
        })
        console.log(response);
        // const data = await response.json();//in react fetch dosent bring data directly we have to process it like this. text is foor text only if we send json from server we have to use .json()
        // console.log(data);
        if(response.status !== 200)
        {
            alert('Login failed - wrong username or password');
        }
        else
        {
            console.log('login successfull')
            const data = await response.json();
            login(data);
            setRedirect(true);
        }
    }
    if(redirect)
    {
        return <Navigate to={'/'} />
    }

    return(
        <form className="login" onSubmit={handleReload}>
            <h1>Login</h1>
            <input type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
            
            <input type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit" onClick={handleLogin}>Login</button>
        </form>
    );
}