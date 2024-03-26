import { useState } from "react";

export default function RegisterPage()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
        // const data = await response.json();//in react fetch dosent bring data directly we have to process it like this. text is for text only if we send json from server we have to use .json()
        // console.log(data);
        // if(data.code === 11000)
        // {
        //     console.log("username already exist");
        // }
        if(response.status !== 200)
        {
            alert('Registration failed');
        }
        else
        {
            console.log('Registration successfull')
        }


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