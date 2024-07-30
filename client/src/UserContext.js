import React, { useState, createContext } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [category, setCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const login = (user) => {
      setUserInfo(user);
      setIsLoggedIn(true);
    };

    const logout = () => {
      setUserInfo({});
      setIsLoggedIn(false);
    };

    const resetCategory = () => {
      setCategory('');
    };

    const setPage = (page) => {
      setCurrentPage(page);
  };

  return (
    <UserContext.Provider value={{userInfo, setUserInfo, isLoggedIn, login, logout, category, setCategory, resetCategory, currentPage, setPage}}>
      {children}
    </UserContext.Provider>
  );
}