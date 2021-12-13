const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const logger = require('morgan');
const path = require('path');
const fileUpload = require("express-fileupload");


require('dotenv').config();
const PORT = process.env.PORT || 3012;

const app = express();
app.use(fileUpload());
app.use(express.json())// add this line
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

app.use(cors())
app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));

// modul routing here

const pkk = require('./pkk');



//app.use('/images', express.static(path.join(__dirname, 'images')))
//app.use('/documents', express.static(path.join(__dirname, 'documents')))

// routing here

// ============================== PKK =======================================

app.post('/api/V1/masdex/pkk', pkk.create);
app.get('/api/V1/masdex/pkk', pkk.read);
app.get('/api/V1/masdex/pkk/:id', pkk.read_by_id);
app.put('/api/V1/masdex/pkk/:id', pkk.update);
app.delete('/api/V1/masdex/pkk/:id', pkk.delete_);
// ==========================================================================


app.get("/", (req, res) => {
    res.send({
        message: "🚀 API Masdex v2.0"
    });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
