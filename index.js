const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const logger = require('morgan');
const path = require('path');
const fileUpload = require("express-fileupload");
const jwt = require('jsonwebtoken');


require('dotenv').config();
const PORT = process.env.PORT || 3012;
const base_url = process.env.base_url;

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
const kapal = require('./kapal');
const pkk = require('./pkk');
const voyage = require('./voyage');
const master_cable = require('./master_cable');
const clearance_in = require('./clearance_in');
const entering_to_port = require('./entering_to_port');
const manouvre = require('./manouvre');
const clearance_out = require('./clearance_out');
const pre_departure = require('./pre_departure');
const departing = require('./departing');
const user = require ('./user');
const user_stakeholder = require ('./user_stakeholder');
//app.use('/images', express.static(path.join(__dirname, 'images')))
//app.use('/documents', express.static(path.join(__dirname, 'documents')))

// routing here

// ============================== Kapal =======================================

app.post('/api/V1/masdex/kapal', kapal.create);
app.get('/api/V1/masdex/kapal', kapal.read);
app.get('/api/V1/masdex/kapal/:id', kapal.read_by_id);
app.get('/api/V1/masdex/kapal/mmsi/:mmsi', kapal.read_by_mmsi);
app.put('/api/V1/masdex/kapal/:id', kapal.update);
app.delete('/api/V1/masdex/kapal/:id', kapal.delete_);
// ==========================================================================

// ============================== Voyage ==============================
app.post('/api/V1/insaf/voyage', voyage.create);
app.get('/api/V1/insaf/voyage', voyage.read);
app.get('/api/V1/insaf/voyage/:id',voyage.read_by_id);
app.put('/api/V1/insaf/voyage/:id', voyage.update);
app.delete('/api/V1/insaf/voyage/:id', voyage.delete_);
// ==========================================================================
// ============================== 1.PKK =======================================

app.post('/api/V1/masdex/pkk', pkk.create);
app.get('/api/V1/masdex/pkk', pkk.read);
app.get('/api/V1/masdex/pkk/:id', pkk.read_by_id);
app.put('/api/V1/masdex/pkk/:id', pkk.update);
app.delete('/api/V1/masdex/pkk/:id', pkk.delete_);
// ==========================================================================
// ============================== 2.Master Cable ==============================
app.post('/api/V1/masdex/master_cable', master_cable.create);
app.get('/api/V1/masdex/master_cable', master_cable.read);
app.get('/api/V1/masdex/master_cable/:id', master_cable.read_by_id);
app.put('/api/V1/masdex/master_cable/:id', master_cable.update);
app.delete('/api/V1/masdex/master_cable/:id', master_cable.delete_);

// =============================== Kurs Tengah ==============================
app.get('/api/V1/kurs',master_cable.kurs_tengah_data);
app.get('/api/V1/kurs_tengah', master_cable.kurs_tengah);
// ==========================================================================

// ================================ Total Tagihan ===========================
app.post('/api/V1/total_tagihan/:location', master_cable.cek_total_tagihan);
// ==========================================================================

// ============================== 3.Clearance In ==============================
app.post('/api/V1/insaf/clearance_in', clearance_in.create);
app.get('/api/V1/insaf/clearance_in', clearance_in.read);
app.get('/api/V1/insaf/clearance_in/:id', clearance_in.read_by_id);
app.put('/api/V1/insaf/clearance_in/:id', clearance_in.update);
app.put('/api/V1/masdex/clearance_in/:id', clearance_in.update_ksu);
app.delete('/api/V1/insaf/clearance_in/:id', clearance_in.delete_);

// ==========================================================================


// ============================== 4.Entering To Port ==========================
app.post('/api/V1/insaf/entering_to_port', entering_to_port.create);
app.get('/api/V1/insaf/entering_to_port', entering_to_port.read);
app.get('/api/V1/insaf/entering_to_port/:id', entering_to_port.read_by_id);
app.put('/api/V1/insaf/entering_to_port/:id', entering_to_port.update);
app.put('/api/V1/insaf/entering_to_port/update_by_otority/:id', entering_to_port.update_by_otoritas);
app.delete('/api/V1/insaf/entering_to_port/:id', entering_to_port.delete_);

// ==========================================================================

// ============================== 5.Manouvre ==========================
app.post('/api/V1/masdex/manouvre', manouvre.create);
app.get('/api/V1/masdex/manouvre', manouvre.read);
app.get('/api/V1/masdex/manouvre/:id', manouvre.read_by_id);
app.put('/api/V1/masdex/manouvre/:id', manouvre.update);
app.put('/api/V1/insaf/manouvre/:id', manouvre.update_operator);
app.delete('/api/V1/insaf/manouvre/:id', manouvre.delete_);

// ==========================================================================

// ============================== 6.Clearance Out ==========================
app.post('/api/V1/masdex/clearance_out/store', clearance_out.create);
app.get('/api/V1/masdex/clearance_out/', clearance_out.index);
app.get('/api/V1/masdex/clearance_out/:id', clearance_out.show);
app.put('/api/V1/masdex/clearance_out/update/:id', clearance_out.update);
app.patch('/api/V1/masdex/clearance_out/delete/:id', clearance_out.destroy);
// ==========================================================================

// ============================== 7.Pre Departure ==========================
app.post('/api/V1/masdex/pre_departure/store/:id', pre_departure.create);
app.get('/api/V1/masdex/pre_departure/', pre_departure.index);
app.get('/api/V1/masdex/pre_departure/:id', pre_departure.show);
app.patch('/api/V1/masdex/pre_departure/delete/:id', pre_departure.destroy);
// ==========================================================================

// ============================== 8.Departure ==========================
app.get('/api/V1/masdex/departing/', departing.index);
app.post('/api/V1/masdex/departing/store', departing.create);
app.get('/api/V1/masdex/departing/:id', departing.show);
app.put('/api/V1/masdex/departing/update/:id', departing.update);
app.patch('/api/V1/masdex/departing/delete/:id', departing.destroy);
app.put('/api/V1/masdex/departing/update/:id', departing.update);
app.patch('/api/V1/masdex/departing/is_departing/:id/:statusdeparting', departing.setStatusdeparting);
app.put('/api/V1/masdex/departing/departing_status/:id', departing.setDepartingStatus);
// ==========================================================================

// =============================== USER =====================================
    app.post('/api/V1/masdex/user', user.create);
    app.get('/api/V1/masdex/user/all', authenticateToken, (req, res) => {
        user.readall(req,res)
    });
    app.get('/api/V1/masdex/user/login', user.read);
    app.put('/api/V1/masdex/user',authenticateToken, (req, res) => {
        user.update(req,res)
    });
    app.delete('/api/V1/masdex/user/:id',authenticateToken, (req, res) => {
        user.delete_(req,res)
    });
// ==========================================================================

// =============================== USER STAKEHOLDER =====================================
    app.post('/api/V1/masdex/user_stakeholder', user_stakeholder.create);
    app.get('/api/V1/masdex/user_stakeholder/all', authenticateToken, (req, res) => {
        user_stakeholder.readall(req,res)
    });
    app.get('/api/V1/masdex/user_stakeholder/login', user_stakeholder.read);
    app.put('/api/V1/masdex/user_stakeholder',authenticateToken, (req, res) => {
        user_stakeholder.update(req,res)
    });
    app.delete('/api/V1/masdex/user_stakeholder/:id',authenticateToken, (req, res) => {
        user_stakeholder.delete_(req,res)
    });
// ==========================================================================

// authentification part======================================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
        //return res.sendStatus(401)
        return res.status(401).send({success:false,data:'Unathorize'})
    }
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = verified
  
      next() // continuamos
  } catch (error) {
      res.status(400).json({error: 'token not valid'})
  }
  
  }
// ==============================================================================
app.get("/", (req, res) => {
    res.send({
        message: "???? API Masdex v2.0"
    });
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
