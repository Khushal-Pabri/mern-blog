import { Link } from "react-router-dom";
import {useContext ,useEffect, useState } from "react";
import { UserContext } from "./UserContext";
export default function Header()
{
  const {setUserInfo, userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  async function fetchData()
  {
    const response = await fetch('https://mern-blog-backend-8x0q.onrender.com/profile', {
      //method: 'GET',
      credentials: 'include'//to save cookies
    })
    const data = await response.json();
    setUserInfo(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function logout(){
    const response = await fetch('https://mern-blog-backend-8x0q.onrender.com/logout', {
      method: 'POST',
      credentials: 'include'
    })
    const data = await response.json();
    console.log(response);
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return(
    <header>
      <Link to="/" className="logo">MyBlog</Link>
      <nav>
      {username ? (
        <>
          <Link to="/my-profile">Profile</Link>
          <Link to="/create-post">Cerate New Post</Link>
          <Link to="/" onClick={logout}>Logout</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      </nav>
    </header>
  );
}