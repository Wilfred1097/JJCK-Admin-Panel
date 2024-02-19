import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Topbar from './Topbar';

const TransactionManagement = () => {


  return (
    <>
      <Topbar />
      <Container fluid>
        <Row>
          {/* Main Content Area */}
          <Col className="p-4">
            <div className='mb-4'>
              <h1>Customer Payment Record</h1>
            </div>
            <Table bordered hover variant="light">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Block #</th>
              <th>Lot #</th>
              <th>Lot Price</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Payment Type</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mar Anthony Fernandez</td>
              <td>1</td>
              <td>2</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>137,500</td>
              <td>Bank Transfer</td>
              <td>12-01-2024</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Ivana Alawi</td>
              <td>4</td>
              <td>11</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>131,250</td>
              <td>E-Wallet</td>
              <td>18-01-2024</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Jason Tatum</td>
              <td>3</td>
              <td>12</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>125,000</td>
              <td>Bank Transfer</td>
              <td>24-01-2024</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Mia Khalifa</td>
              <td>1</td>
              <td>2</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>137,500</td>
              <td>Bank Transfer</td>
              <td>12-01-2024</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Jason Derulo</td>
              <td>1</td>
              <td>3</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>137,500</td>
              <td>E-Wallet</td>
              <td>12-01-2024</td>
            </tr>
          </tbody>
        </Table>
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          {/* Main Content Area */}
          <Col className="p-4">
            <div className='mb-4'>
              <h1>Customer Overdue Bill</h1>
            </div>
            <Table bordered hover variant="light">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Block #</th>
              <th>Lot #</th>
              <th>Lot Price</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark Herras</td>
              <td>1</td>
              <td>2</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>137,500</td>
              <td>14-01-2024</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Vice Ganda</td>
              <td>4</td>
              <td>11</td>
              <td>300,000</td>
              <td>6,250</td>
              <td>131,250</td>
              <td>25-01-2024</td>
            </tr>
          </tbody>
        </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TransactionManagement;
