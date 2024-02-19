require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',  // Replace with the actual origin of your client application
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// const pool = mysql.createPool({
//   host: 'b4svrhz1pxumygusk30q-mysql.services.clever-cloud.com',
//   user: 'uvxa2eya4zuwpvll',
//   password: 'SWphMgAOhgHQqaIMF7PC',
//   database: 'b4svrhz1pxumygusk30q',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// Check database connection
pool.getConnection((connectionError, connection) => {
  if (connectionError) {
    console.error('Error connecting to the database:', connectionError.message);
    process.exit(1); // Exit the process if the database connection fails
  }

  console.log('Connected to the database!');
  connection.release(); // Release the connection

  // Continue with your Express app setup
  app.get('/', (req, res) => {
    res.send('Hello from the server!');
  });


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// register api
app.post('/register', async (req, res) => {
    const { completename, birthdate, address, email, password } = req.body;
  
    try {
      // Check if the email already exists
      pool.execute(
        'SELECT * FROM admin WHERE email = ?',
        [email],
        async (selectError, selectResults) => {
          if (selectError) {
            console.error('Error checking email existence:', selectError.message);
            return res.status(500).json({ message: 'Error checking email existence', error: selectError.message });
          }
  
          // If email already exists, return an error
          if (selectResults.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
          }
  
          // Hash the password using bcrypt
          const hashedPassword = await bcryptjs.hash(password, 10);
  
          // Insert user data into the 'users' table
          pool.execute(
            'INSERT INTO admin (complete_name, birthdate, address, email, password) VALUES (?, ?, ?, ?, ?)',
            [completename, birthdate, address, email, hashedPassword],
            (insertError, insertResults) => {
              if (insertError) {
                console.error('Error inserting user data:', insertError.message);
                return res.status(500).json({ message: 'Error registering user', error: insertError.message });
              }
  
              console.log('User registered successfully');
              res.status(200).json({ message: 'User registered successfully' });
            }
          );
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error.message);
      res.status(500).json({ message: 'Unexpected error', error: error.message });
    }
  });

// Helper function to generate JWT token
function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

// Login api
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if the email exists in the database
      const [user] = await pool.promise().query('SELECT * FROM admin WHERE email = ?', [email]);

      if (user.length === 0) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcryptjs.compare(password, user[0].password);

      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Sign a JWT with a secret key including userId in the payload
      const token = jwt.sign({ userId: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, maxAge: 600000 }); // 10 minutes expiration in milliseconds

      // Send the token in the response
      res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Logout API
app.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  
  // Respond with a success message
  res.status(200).json({ message: 'Logout successful' });
});

// Fetch all users API
app.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the users table
    const [users] = await pool.promise().query('SELECT userId, complete_name, birthdate, address, email, DATE_FORMAT(registratrion_date, "%Y-%m-%d") AS registratrion_date FROM users');
    
    // Send the users data as a response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/updateUser', async (req, res) => {
  const { userId, completeName, birthdate, address, email } = req.body;

  try {
    // Update user data in the database
    const [updateResult] = await pool.promise().execute(
      'UPDATE users SET complete_name = ?, birthdate = ?, address = ?, email = ? WHERE userId = ?',
      [completeName, birthdate, address, email, userId]
    );

    console.log('Update result:', updateResult);

    if (updateResult.affectedRows > 0) {
      // User updated successfully
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      // No user found with the given userId
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint to add listing data
app.post('/addListing', async (req, res) => {
  try {
    // Extract data from the request body
    const { block, lotNumber, dimension, price, term, downpayment, status, images } = req.body;

    // Check if the block_number and lot_number already exist in the database
    const checkQuery = 'SELECT * FROM lot_table WHERE block_number = ? AND lot_number = ?';
    const checkValues = [block, lotNumber];

    pool.execute(checkQuery, checkValues, (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking existing record:', checkError.message);
        res.status(500).json({ message: 'Error checking existing record', error: checkError.message });
        return;
      }

      if (checkResults.length > 0) {
        // If a record with the same block_number and lot_number exists, return an error
        console.log('Record already exists');
        res.status(400).json({ message: 'Record already exists' });
      } else {
        // If no record with the same block_number and lot_number exists, insert the new listing
        const insertQuery = 'INSERT INTO lot_table (block_number, lot_number, dimension, price, term, downpayment, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [block, lotNumber, dimension, price, term, downpayment, status, images.join(',')];
        
        pool.execute(insertQuery, insertValues, (insertError, insertResults) => {
          if (insertError) {
            console.error('Error inserting listing data:', insertError.message);
            res.status(500).json({ message: 'Error inserting listing data', error: insertError.message });
            return;
          }

          console.log('Listing data inserted successfully');
          res.status(200).json({ message: 'Listing data inserted successfully' });
        });
      }
    });
  } catch (error) {
    console.error('Error handling addListing request:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/lot-listings', async (req, res) => {
  try {
    // Retrieve all listings from the lot_table
    const [users] = await pool.promise().query('SELECT * FROM lot_table');
    
    // Send the users data as a response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint to update lot listing data
app.post('/updateListing', async (req, res) => {
  try {
    // Extract data from the request body
    const { lot_Id, block, lotNumber, dimension, price, term, downpayment, status, images } = req.body;

    // Construct the query to update the listing data
    const query = `
      UPDATE lot_table 
      SET block_number = ?, lot_number = ?, dimension = ?, price = ?, term = ?, downpayment = ?, status = ?, image = ? 
      WHERE lot_Id = ?
    `;
    const values = [block, lotNumber, dimension, price, term, downpayment, status, images.join(','), lot_Id];

    // Execute the query
    pool.execute(query, values, (error, results) => {
      if (error) {
        console.error('Error updating listing data:', error.message);
        res.status(500).json({ message: 'Error updating listing data', error: error.message });
        return;
      }

      // Check if any row was affected by the update
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Listing data updated successfully' });
      } else {
        // No listing found with the given lot_Id
        res.status(404).json({ message: 'Lot listing not found' });
      }
    });
  } catch (error) {
    console.error('Error handling updateListing request:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/tour-requests', async (req, res) => {
  try {
    // Retrieve all users from the users table
    const [users] = await pool.promise().query('SELECT * FROM tour_request_view');
    
    // Send the users data as a response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});