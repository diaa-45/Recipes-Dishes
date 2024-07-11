const express = require('express');
const bodyParser = require('body-parser');
const recipeRouter = require('./routes/recipesRoutes');
const cors = require('cors');
const app = express();
const PORT = 8989;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', recipeRouter);

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});