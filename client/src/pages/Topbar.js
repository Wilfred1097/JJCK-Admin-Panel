import React, { useState } from 'react';
import { Navbar, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import { FaBars } from 'react-icons/fa';

const Topbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        // Logout successful
        console.log('Logout successful');
        // Redirect to the homepage
        navigate('/');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" className="justify-content-between" style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
      <Button variant="outline-light" onClick={toggleSidebar} ><FaBars /></Button>
       {/* <Navbar.Brand>JJCK Realty Services</Navbar.Brand> */}
        <div className="d-flex align-items-center">
          <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
        </div>
      </Navbar>

      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>JJCK Realty Services</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Topbar;
