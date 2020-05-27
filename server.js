require('./config');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('API Rest');
});

// Routes
app.use('/v1',require('./routes'));

app.listen(process.env.PORT, () => {
    console.log(`Server online on PORT ${process.env.PORT}`);
})