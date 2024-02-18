import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Container, Row, Button, Table, Modal, Form, Col, Image } from 'react-bootstrap';
import Topbar from './Topbar';
import { addNewListingSchema } from '../validation/Validation';

const LotManagement = () => {
  const [lotListings, setLotListings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    block: '',
    lotNumber: '',
    dimension: '',
    price: '',
    term: '',
    downpayment: '',
    status: 'Available',
    images: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleSubmit = () => {
    // Validate form data against Yup schema
    addNewListingSchema.validate(formData)
      .then(validFormData => {
        // Form data is valid, proceed with submission
        // console.log(validFormData); // Log the valid form data (including images in base64 format)
  
        fetch('http://localhost:3001/addListing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validFormData),
        })
          .then(response => {
            if (response.status === 200) {
              // console.log('Success:', response);
              toggleAddModal(); // Close the modal after submitting
              // Refresh table content after successful addition
              fetchLotListings(); // Fetch updated data
            } else if (response.status === 400) {
              // console.error('Record already exists');
              alert('Record already exists');
            } else {
              throw new Error('Network response was not ok');
            }
          })
          .catch(error => {
            // console.error('Error:', error);
            // Handle other errors appropriately
          });
      })
      .catch(validationError => {
        // Form data is invalid, handle validation errors
        alert(validationError.errors.join(', '));
        // Display all validation errors in the alert
      });
  };

  // Fetch lot listings data from the API
  const fetchLotListings = async () => {
    try {
      const response = await fetch('http://localhost:3001/lot-listings');
      if (response.ok) {
        const data = await response.json();
        setLotListings(data);
      } else {
        console.error('Failed to fetch lot listings data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lot listings data:', error.message);
    }
  };

  useEffect(() => {
    fetchLotListings();
  }, []);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleEditModal = (lotId) => {
    // Find the selected listing from lotListings based on lotId
    const selectedListing = lotListings.find(listing => listing.lot_Id === lotId);
    
    // Update formData state with the data of the selected listing
    setFormData({
      block: selectedListing.block_number,
      lotNumber: selectedListing.lot_number,
      dimension: selectedListing.dimension,
      price: selectedListing.price,
      term: selectedListing.term,
      downpayment: selectedListing.downpayment,
      status: selectedListing.status,
      images: [], // Assuming images are not prepopulated
    });
  
    // Set the selected lot ID and show the edit modal
    setSelectedLotId(lotId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    // Reset formData state when closing the edit modal without changes
    setFormData({
      block: '',
      lotNumber: '',
      dimension: '',
      price: '',
      term: '',
      downpayment: '',
      status: 'Available',
      images: [],
    });
  
    // Reload the page to reflect any potential changes
    window.location.reload();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedListings = lotListings.sort((a, b) => {
    if (sortConfig.key !== null) {
      const keyA = a[sortConfig.key];
      const keyB = b[sortConfig.key];
      if (keyA < keyB) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (keyA > keyB) return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleUpdate = async () => {
    try {
      const updatedListing = lotListings.find(listing => listing.lot_Id === selectedLotId);
      if (!updatedListing) {
        console.error('Lot listing not found');
        return;
      }
    
      const updatedData = {
        lot_Id: selectedLotId,
        block: formData.block,
        lotNumber: formData.lotNumber,
        dimension: formData.dimension,
        price: formData.price,
        term: formData.term,
        downpayment: formData.downpayment,
        status: formData.status,
        images: formData.images.length > 0 ? formData.images : [updatedListing.image] // Use existing image if no new images are selected
      };
    
      // Log updated listing data
      console.log('Updated Listing:', updatedData);
    
      // Make a POST request to the backend server to update the listing data
      const response = await fetch('http://localhost:3001/updateListing', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Update success:', data);
  
        // Refetch the updated data from the server
        const updatedListingsResponse = await fetch('http://localhost:3001/lot-listings');
        if (updatedListingsResponse.ok) {
          const updatedListingsData = await updatedListingsResponse.json();
          // Update the local state with the updated data
          setLotListings(updatedListingsData);
          setShowEditModal(false);
        } else {
          console.error('Failed to fetch updated data:', updatedListingsResponse.statusText);
        }
      } else {
        console.error('Error updating listing:', response.statusText);
        // Handle error appropriately, such as displaying a message to the user
      }
    } catch (error) {
      console.error('Error updating listing:', error.message);
      // Handle error appropriately, such as displaying a message to the user
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', (error) => reject(error));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((imageData) => {
      setFormData({ ...formData, images: imageData });
    });
  };
  
  const handlePreviewImage = (imageData) => {
    setSelectedImage(imageData);
  };

  return (
    <>
      <Topbar />
      <Container fluid>
        <Row>
          {/* Main Content Area */}
          <div className="p-4" style={{ backgroundColor: 'white', width: '100%' }}>
            <div>
              <Row className="mb-3">
                <Col>
                  <h2>Lot Management</h2>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button onClick={toggleAddModal} className="mb-3">Add Listings</Button>
                </Col>
              </Row>
              <div className="table-responsive">
                <Table striped bordered hover responsive>
                  <thead className='table-primary'>
                    <tr>
                      <th onClick={() => handleSort('lot_Id')}><b>#</b></th>
                      <th onClick={() => handleSort('block_number')}><b>Block #</b></th>
                      <th onClick={() => handleSort('lot_number')}><b>Lot #</b></th>
                      <th onClick={() => handleSort('dimension')}><b>Dimension</b></th>
                      <th onClick={() => handleSort('price')}><b>Price</b></th>
                      <th onClick={() => handleSort('term')}><b>Term</b></th>
                      <th onClick={() => handleSort('downpayment')}><b>Downpayment</b></th>
                      <th onClick={() => handleSort('status')}><b>Status</b></th>
                      <th><b>Image</b></th>
                      <th><b>Action</b></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedListings.map(listing => (
                      <tr key={listing.lot_Id}>
                        <td>{listing.lot_Id}</td>
                        <td>{listing.block_number}</td>
                        <td>{listing.lot_number}</td>
                        <td>{listing.dimension}</td>
                        <td>{listing.price}</td>
                        <td>{listing.term}</td>
                        <td>{listing.downpayment}</td>
                        <td>{listing.status}</td>
                        <td>
                          {listing.image && (
                            <Button variant="secondary" onClick={() => handlePreviewImage(listing.image)}>
                              Preview
                            </Button>
                          )}
                        </td>
                        <td>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ margin: '5px', display: 'inline-block' }}>
                              <Button onClick={() => toggleEditModal(listing.lot_Id)}>Edit</Button>
                            </div>
                            <div style={{ margin: '5px', display: 'inline-block' }}>
                              <Button variant='danger'>Delete</Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Row>
      </Container>

      {/* Add listing Modal */}
      <Modal size="md" centered backdrop="static" show={showAddModal} onHide={toggleAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Listings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="block">
              <Form.Label>Block #</Form.Label>
              <Form.Control type="text" placeholder="Enter Block #" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="lotNumber">
              <Form.Label>Lot #</Form.Label>
              <Form.Control type="text" placeholder="Enter Lot #" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="dimension">
              <Form.Label>Dimension</Form.Label>
              <Form.Control type="text" placeholder="Enter Dimension" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="text" placeholder="Enter Price" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="term">
              <Form.Label>Term</Form.Label>
              <Form.Control type="text" placeholder="Enter Term" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="downpayment">
              <Form.Label>Downpayment</Form.Label>
              <Form.Control type="text" placeholder="Enter Downpayment" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="images">
              <Form.Label>Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add listing
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit listing Modal */}
      <Modal size="md" centered backdrop="static" show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="block">
              <Form.Label>Block #</Form.Label>
              <Form.Control type="text" placeholder="Enter Block #" value={formData.block} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="lotNumber">
              <Form.Label>Lot #</Form.Label>
              <Form.Control type="text" placeholder="Enter Lot #" value={formData.lotNumber} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="dimension">
              <Form.Label>Dimension</Form.Label>
              <Form.Control type="text" placeholder="Enter Dimension" value={formData.dimension} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="text" placeholder="Enter Price" value={formData.price} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="term">
              <Form.Label>Term</Form.Label>
              <Form.Control type="text" placeholder="Enter Term" value={formData.term} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="downpayment">
              <Form.Label>Downpayment</Form.Label>
              <Form.Control type="text" placeholder="Enter Downpayment" value={formData.downpayment} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select value={formData.status} onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="images">
              <Form.Label>Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
            </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Update listing
            </Button>
          </Modal.Footer>
        </Modal>


      {/* Preview Image Modal */}
      <Modal size="md" centered backdrop="static" show={selectedImage !== null} onHide={() => setSelectedImage(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Preview Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={selectedImage} fluid />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LotManagement;
