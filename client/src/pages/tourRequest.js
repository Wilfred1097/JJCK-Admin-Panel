import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Form, FormControl, Button } from 'react-bootstrap';
import Topbar from './Topbar';

function TourRequestPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tourRequests, setTourRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);

    // Function to handle search term change
    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        const filtered = tourRequests.filter(request => {
            return (
                request.request_Id.toString().includes(searchTerm) ||
                request.block_number.toString().includes(searchTerm) ||
                request.lot_Id.toString().includes(searchTerm) ||
                request.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                formatDate(request.request_date).includes(searchTerm) ||
                formatDate(request.date_requested).includes(searchTerm) ||
                request.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredRequests(filtered);
    };

    // Function to format date in "YYYY-MM-DD" format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Function to fetch tour requests data
    const fetchTourRequests = async () => {
        try {
            const response = await fetch('http://localhost:3001/tour-requests');
            if (response.ok) {
                const data = await response.json();
                setTourRequests(data);
                setFilteredRequests(data); // Initialize filtered requests with all requests
            } else {
                console.error('Failed to fetch tour requests');
            }
        } catch (error) {
            console.error('Error fetching tour requests:', error);
        }
    };

    // Fetch tour requests data on component mount
    useEffect(() => {
        fetchTourRequests();
    }, []);

    return (
        <>
            <Topbar />
            <div className="container-fluid mt-5">
                <Row className="mb-3">
                    <Col>
                        <h2>Tour Request Page</h2>
                    </Col>
                    <Col xs={12} md={4} lg={3}>
                        <Form>
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="mr-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </Form>
                    </Col>
                </Row>
                <Table responsive bordered hover className="w-100">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Block Number</th>
                            <th>Lot Number</th>
                            <th>Name</th>
                            <th>Tour Request Date</th>
                            <th>Date Requested</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(request => (
                            <tr key={request.request_Id}>
                                <td>{request.request_Id}</td>
                                <td>{request.block_number}</td>
                                <td>{request.lot_Id}</td>
                                <td>{request.user_name}</td>
                                <td>{formatDate(request.request_date)}</td>
                                <td>{formatDate(request.date_requested)}</td>
                                <td>{request.status}</td>
                                <td>
                                    <Button variant="success">Accept</Button>{' '}
                                    <Button variant="danger">Decline</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default TourRequestPage;
