const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db.js');
const userRoutes = require('./controllers/userRouter.js');
const universityResource = require('./controllers/universityRouter.js')
const errorHandler = require('./middleware/errorHandler.js')


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', userRoutes);
app.use('/api/resources', universityResource);

app.get('/', async (req, res) => {
  console.log('Root route accessed');
  res.send('Welcome to the Home Page');
})

app.use(errorHandler);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;