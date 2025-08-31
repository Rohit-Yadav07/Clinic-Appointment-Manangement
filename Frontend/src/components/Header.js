import React from 'react';
import LogoutButton from './LogoutButton';

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 32px',
  background: 'rgba(255,255,255,0.85)',
  boxShadow: '0 2px 8px rgba(67,206,162,0.10)',
  position: 'relative',
  zIndex: 1201,
};

const logoStyle = {
  height: 48,
  width: 48,
  marginRight: 16,
};

const titleStyle = {
  fontWeight: 900,
  fontSize: 28,
  color: '#1976d2',
  letterSpacing: 2,
  fontFamily: 'Montserrat, Roboto, sans-serif',
};

const Header = () => {
  // Hide logout button on login and signup pages
  const path = window.location.pathname;
  const hideLogout = path === '/login' || path === '/signup';
  return (
    <header style={headerStyle}>
      <img src="/image.png" alt="Doctor Logo" style={logoStyle} />
      <span style={titleStyle}>CheckInCare</span>
      <div style={{ flex: 1 }} />
      {!hideLogout && <LogoutButton />}
    </header>
  );
};

export default Header;
