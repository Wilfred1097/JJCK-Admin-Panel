import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './SideBar';
import Dashboard from './Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';

function AdminPanel() {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        
        {/* Main Content Area */}
        <Col md={10} className="p-4 content">
          <Routes>
            {/* Default Redirect to /admin/dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />

            {/* Dashboard Route */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPanel;
