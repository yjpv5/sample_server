const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db.js');
const userRoutes = require('./controllers/userRouter.js');
const universityResource = require('./controllers/universityRouter.js')
const errorHandler = require('./middleware/errorHandler.js')
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', userRoutes);
app.use('/api/resources', universityResource);

app.get('/', async (req, res) => {
  console.log('Root route accessed');
  res.send('Welcome to the Home Page');
})

app.use(errorHandler);
setupSwagger(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;