import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Error404Page = () => {
    return (
        <Container className="text-center">
            <Row className="justify-content-center">
                <Col xs={12} md={6} className="text-center">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <Button variant="primary" href="/">Go Back to Home</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Error404Page;
