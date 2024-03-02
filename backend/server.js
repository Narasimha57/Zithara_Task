const express = require('express');
const pg = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors());


pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Database connected successfully!');
  release();
});

app.use(express.json());

app.get('/api/records', async (req, res) => {
  try {
    let query = 'SELECT * FROM customer';

    if (req.query.searchTerm) {
      const searchTerm = req.query.searchTerm.toLowerCase(); 
      query += ` WHERE LOWER(customer_name) LIKE '%${searchTerm}%' OR LOWER(location) LIKE '%${searchTerm}%'`;
    }

    
    const queryResult = await pool.query(query);
    const data = queryResult.rows;

    
    res.json(data);
  } catch (error) {
    
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
