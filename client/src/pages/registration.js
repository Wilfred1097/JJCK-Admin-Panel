import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { RegistrationvalidationSchema } from '../validation/Validation';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      address: '',
      dob: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: RegistrationvalidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:3001/register', {
          completename: values.fullName,
          address: values.address,
          birthdate: values.dob,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        console.log(response.data.message);

        if (response.data.message === 'User registered successfully') {
          // Redirect to the login page after successful registration
          navigate('/');
        }
        // Optionally, you can reset the form or navigate to another page after successful registration
      } catch (error) {
        console.error('Error registering user:', error.message);
      }
    },
  });

  return (
    <Container>
      <Row className="justify-content-md-center mt-5 p-3">
        <Col xs={12} md={6}>
          <Form onSubmit={formik.handleSubmit}>
            <h2 className="text-center">Registration</h2>

            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.fullName && formik.errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.touched.fullName && formik.errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.address && formik.errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.touched.address && formik.errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter your date of birth"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.dob && formik.errors.dob}
              />
              <Form.Control.Feedback type="invalid">
                {formik.touched.dob && formik.errors.dob}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.touched.email && formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && formik.errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {formik.touched.password && formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {formik.touched.confirmPassword && formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className={`m-2 ${formik.touched.email || formik.touched.password ? '' : 'btn-block'}`}>
              Register
            </Button>
            <Button as={Link} to="/" variant='success' className='m-2 p-auto'>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
