const express = require('express');
//const errorHandler = require('./middleware/error')
const routes = require('./routes/projects');
//const authRoutes = require('./routes/auth')
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.use('/projects', routes);
//app.use("/auth", authRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });