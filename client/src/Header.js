import { Link } from "react-router-dom";
import {useContext ,useEffect, useState } from "react";
import { UserContext } from "./UserContext";
export default function Header()
{
  const {setUserInfo, userInfo, isLoggedIn, logout, resetCategory, setPage} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  async function fetchData()
  {
    const response = await fetch('https://mern-blog-backend-8x0q.onrender.com/profile', {
      //method: 'GET',
      credentials: 'include'//to save cookies
    })
    const data = await response.json();
    console.log(data);
    setUserInfo(data);
  }

  useEffect(() => {
    // if (isLoggedIn) {
    //     fetchData();
    // }
    fetchData();
}, [isLoggedIn]);

  async function handleLogout(){
    console.log('invoked logout');
    const response = await fetch('http://localhost:4400/logout', {
      method: 'POST',
      credentials: 'include'
    })
    // const data = await response.json();
    // console.log(response);
    logout();
  }

  const handleLogoClick = () => {
    resetCategory();
    setPage(1);
  };

  const username = userInfo?.username;

  return(
    <header>
      <Link to="/" className="logo" onClick={handleLogoClick}>BlogNest</Link>
      <nav>
      {username ? (
        <>
          <Link to="/my-profile">Profile</Link>
          <Link to="/create-post">Cerate New Post</Link>
          <Link to="/" onClick={handleLogout}>Logout</Link>
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