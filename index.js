const express = require('express');
const cors = require('cors');
require('dotenv').config()

const PORT = process.env.REACT_APP_PORT || 5000;

const app = express();

//Enable cors
app.use(cors({
  origin: ['http://localhost:3000', 'https://nazariialieksieiev.github.io'],
  credentials: true 
}));

//Routes
app.use('/find_movie', require('./routes/index'))

app.listen(PORT, () => console.log(`Server runnig on port ${PORT}`))
