const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // thêm
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // thêm

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Hello Backend!');
});

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
