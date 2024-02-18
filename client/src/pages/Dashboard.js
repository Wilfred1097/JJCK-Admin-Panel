import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Topbar from './Topbar';

const Dashboard = () => {
  return (
    <>
      <Topbar /> {/* Add Topbar here */}
      <Container fluid>
        <Row>

          {/* Main Content Area */}
          <Col md={10} className="p-4" style={{ backgroundColor: 'white' }}>
            <div>
              <h1>Dashboard</h1>
              <p>Welcome to the Admin Dashboard!</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
