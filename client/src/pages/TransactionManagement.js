import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Topbar from './Topbar';

const TransactionManagement = () => {


  return (
    <>
      <Topbar />
      <Container fluid>
        <Row>
          {/* Main Content Area */}
          <Col className="p-4">
            <div>
              <h1>Transaction Record</h1>
              <p>Welcome to Transaction Record where you can manage record</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TransactionManagement;
