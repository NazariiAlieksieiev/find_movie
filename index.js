const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const PORT = process.env.PORT || 5000;

const app = express();

//Routes
app.use('/find_movie', require('./routes/index'))

// Set static folder
app.use(express.static('public'));


//Enable cors
app.use(cors({
  origin: 'http://localhost:5000/find_movie',
  credentials: true 
}));

app.listen(PORT, () => console.log(`Server runnig on port ${PORT}`))
