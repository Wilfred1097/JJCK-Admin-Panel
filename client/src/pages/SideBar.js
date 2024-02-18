import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaMap } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

const Sidebar = () => {
  const location = useLocation();
  const [showSidebar] = useState(true);

  const sidebarLinks = [
    { to: '/admin/dashboard', text: 'Dashboard', icon: <FaHome /> },
    { to: '/admin/record', text: 'Transaction Management', icon: <GrTransaction />  },
    { to: '/admin/lotregistration', text: 'Lot Management', icon: <FaMap />  },
    { to: '/admin/usermanagement', text: 'User Management', icon: <FaUsers />  },
    { to: '/admin/tour-request', text: 'Tour Request', icon: <FaUsers />  }
  ];

  return (
    <>
      {/* Sidebar */}
      {showSidebar && (
        <Nav className="flex-column bg-light py-4" style={{ height: '100%' }}>
          {sidebarLinks.map((link, index) => (
            <Nav.Link 
              key={index} 
              as={Link} 
              to={link.to} 
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              style={{ transition: 'background-color 0.3s' }} // Add transition for smooth hover effect
              // Add hover effect CSS
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'inherit'}
            >
              {link.icon && <span className="me-2">{link.icon}</span>} {/* Render the icon if it exists */}
              {link.text}
            </Nav.Link>
          ))}
        </Nav>
      )}
    </>
  );
};

export default Sidebar;
