import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { LoginvalidationSchema } from './validation/Validation';
import Cookies from 'js-cookie';
import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Validate the input using Yup schema
      await LoginvalidationSchema.validate({ email, password }, { abortEarly: false });

      // If validation passes, send the login data to the server
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });

      // Check if the response contains a token
      const { message, token } = response.data;

      if (message === 'Login successful' && token) {
        // Store the token in cookies using js-cookie
        Cookies.set('token', token, { path: '/' });
        navigate('/admin');
        // Redirect or perform any necessary action after successful login
      } else {
        console.error('Token not found in the server response');
      }

      // Add any additional logic based on the server response if needed
      setValidationErrors({ email: '', password: '' }); // Reset validation errors
    } catch (error) {
      // If validation fails, update the validation error state
      const errors = {};

      if (error.response && error.response.status === 401) {
        // Display an alert for invalid credentials
        window.alert('Invalid email or password');
      } else if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
      }

      setValidationErrors(errors);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <Card className="p-3 border-0" style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', borderRadius: '15px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <Card.Body>
              <h2 className="text-center">JJCK Realty Services</h2>
              <h3 className="text-center">Admin Login</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!validationErrors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!validationErrors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className={`m-2 ${validationErrors.email || validationErrors.password ? '' : 'btn-block'}`}>
                  Login
                </Button>
                {/* <Button as={Link} to="/registration" variant='success' className='m-2 p-auto'>
                  Register
                </Button> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
