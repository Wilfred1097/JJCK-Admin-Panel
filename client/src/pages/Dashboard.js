import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Topbar from './Topbar';
import { FcSalesPerformance, FcLandscape, FcBusinessman } from "react-icons/fc";
import { MdTour } from "react-icons/md";


const Dashboard = () => {
  return (
    <>
      <Topbar />
      <Container fluid>
        {/* Main Content Area */}
        <Col md={10} className="p-4" style={{ backgroundColor: 'white' }}>
          <div>
            <h2>Analytics Overview</h2>
          </div>
        </Col>
        <Row>
          {/* Four Cards */}
          <Col md={3} className="p-3">
            <Card>
              <Card.Body>
                <FcSalesPerformance size={40} color="blue" />
                <Card.Title>Sales</Card.Title>
                <Card.Text>239,000</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="p-3">
            <Card>
              <Card.Body>
                <FcLandscape size={40} color="green" />
                <Card.Title>Lot listed</Card.Title>
                <Card.Text>142</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="p-3">
            <Card>
              <Card.Body>
                <MdTour size={40} color="orange" />
                <Card.Title>Tour Request</Card.Title>
                <Card.Text>10</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="p-3">
            <Card>
              <Card.Body>
                <FcBusinessman size={40} color="red" />
                <Card.Title>Registered User</Card.Title>
                <Card.Text>30</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
