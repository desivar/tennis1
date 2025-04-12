const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import swaggerSpec

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ... your API routes ...

app.listen(5500, () => {
    console.log('Server running on port 5500');
});