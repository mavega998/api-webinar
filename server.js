require('./config');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('API Rest');
});

// Routes
app.use('/v1',require('./routes'));

app.listen(process.env.PORT, () => {
    console.log(`Server online on PORT ${process.env.PORT}`);
})