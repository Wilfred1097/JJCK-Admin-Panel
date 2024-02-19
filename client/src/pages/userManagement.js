import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Modal, Form, Button, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Topbar from './Topbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    completeName: '',
    birthdate: '',
    address: '',
    email: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch user data from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUsers();
  }, []); // Run once on component mount

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: formData.userId // Include userId in the request body
        })
      });
      if (response.ok) {
        // Handle success
        console.log('User updated successfully');
        
        // Fetch the updated user data
        const updatedResponse = await fetch('http://localhost:3001/users');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setUsers(updatedData);
        } else {
          console.error('Failed to fetch updated user data:', updatedResponse.statusText);
        }
  
        handleCloseModal();
      } else {
        // Handle error
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user => {
    return (
      (user.complete_name && user.complete_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.birthdate && user.birthdate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  

  return (
    <>
      <Topbar />
      <Container fluid>
        <Row className="align-items-center">
          {/* Heading and Search Bar */}
          <div className="d-flex justify-content-between align-items-center">
          <h1>User Management</h1>
          <Form className="d-flex m-3 w-50">
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2"
              aria-label="Search"
              onChange={handleSearch}
            />
          </Form>
        </div>

          {/* Main Content Area */}
          <Col md={12} className="p-4" style={{ backgroundColor: 'white' }}>
            <div className="table-responsive">
              <Table bordered hover responsive>
                <thead className='table-primary'>
                  <tr>
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Birthdate</th>
                    <th>Address</th>
                    <th>Email</th>
                    {/* <th>Password</th> */}
                    <th>Registration Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.complete_name}</td>
                      <td>{user.birthdate}</td>
                      <td>{user.address}</td>
                      <td>{user.email}</td>
                      {/* <td>{user.password}</td> */}
                      <td>{user.registratrion_date}</td>
                      <td>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ margin: '5px', display: 'inline-block' }}>
                            <FaEdit
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                // Populate form data with user details including userId
                                setFormData({
                                  userId: user.userId,
                                  completeName: user.complete_name,
                                  birthdate: user.birthdate,
                                  address: user.address,
                                  email: user.email,
                                });
                                handleShowModal();
                              }}
                            />
                          </div>
                          <div style={{ margin: '5px', display: 'inline-block' }}>
                            <FaTrash style={{ cursor: 'pointer' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Update User Modal */}
      <Modal size="md" centered backdrop="static" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="completeName">
              <Form.Label>Complete Name</Form.Label>
              <Form.Control
                type="text"
                name="completeName"
                value={formData.completeName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="birthdate">
              <Form.Label>Birthdate</Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update Record
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
