import React from 'react';
import { useLocation } from 'react-router-dom';
import MyNavbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ['/', '/signup', '/login','/admin','/queries','/payments', '/logout','/adminlogin'];

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <MyNavbar />}
      {children}
    </>
  );
};

export default Layout;
