const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Middleware
const { requireAuth } = require('./middleware/authMiddleware');

// Route imports
const studentRoutes = require('./routes/studentRoutes');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const vaccinationDriveRoutes = require('./routes/vaccinationDriveRoutes');
const vaccinationRecordRoutes = require('./routes/vaccinationRecordRoutes');
const studentUploadRoutes = require('./routes/studentUploadRoute');
const dashboardRoutes = require('./routes/dashboardRoute');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Vaccination Management API',
      version: '1.0.0',
      description: 'API documentation for the School Vaccination Management System',
    },
    servers: [
      {
        url: 'http://192.168.29.7:3000',
        description: 'Local IP access'
      },
      {
        url: 'http://localhost:3000',
        description: 'Localhost access'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './models/*.js'],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Unprotected user routes
app.use('/users', userRoutes);

// Apply authentication globally for remaining routes
app.use(requireAuth);

// Protected routes
app.use('/students', studentRoutes);
app.use('/classes', classRoutes);
app.use('/vaccines', vaccineRoutes);
app.use('/drives', vaccinationDriveRoutes);
app.use('/records', vaccinationRecordRoutes);
app.use('/students', studentUploadRoutes); // handles /students/upload
app.use('/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Vaccination Management Backend');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
