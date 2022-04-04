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
const kategori_kapal = require('./kategori_kapal');
const pkk = require('./pkk');
const noon_position = require('./noon_position');
const voyage = require('./voyage');
const notice_to_marine = require('./notice_to_marine');
const master_cable = require('./master_cable');
const master_vts = require('./master_vts');
const alasan_manouvre = require('./alasan_manouvre');
const clearance_in = require('./clearance_in');
const entering_to_port = require('./entering_to_port');
const manouvre = require('./manouvre');
const clearance_out = require('./clearance_out');
const pre_departure = require('./pre_departure');
const departing = require('./departing');
const user = require ('./user');
const user_stakeholder = require ('./user_stakeholder');
const stakeholder = require ('./stakeholder');
const telkompel =  require ('./telkompel');
const pelabuhan =  require ('./pelabuhan');
const dermaga =  require ('./dermaga');
const area_tambat =  require ('./area_tambat');
const area_labuh =  require ('./area_labuh');
const jenis_berita = require('./jenis_berita')
const jenis_securite = require('./jenis_securite')
const jenis_informasi_securite = require('./jenis_informasi_securite')
const jenis_pelanggaran = require('./jenis_pelanggaran')
const jenis_pelayaran = require('./jenis_pelayaran')
const terminal = require('./terminal')
const jenis_pan = require('./jenis_pan')
const jenis_status_navigation = require('./jenis_status_navigation')
const jenis_manouvre = require('./jenis_manouvre')
const jenis_berita_marine_safety_informasi = require('./jenis_berita_marine_safety_informasi')
const histori_chat = require('./histori_chat')
const distress = require('./distress')
const pan = require('./pan')
const securite = require('./securite')
const msi = require('./msi')
const jenis_distress = require('./jenis_distress')
const jenis_stakeholder = require('./jenis_stakeholder')
const jenis_kapal = require('./jenis_kapal')
const spesialisasi_kesehatan = require('./spesialisasi_kesehatan')
const contravention = require('./contravention')
const pasien = require('./pasien')
const tmas = require('./tmas')
const sumber_informasi = require('./sumber_informasi')
const dbWeathers = require ('./weather')

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
app.post('/api/V1/masdex/categoryofship',kategori_kapal.read);

// ==========================================================================

// ============================== Voyage ==============================
app.post('/api/V1/insaf/voyage', voyage.create);
app.get('/api/V1/insaf/voyage_status', voyage.voyage_status);
app.get('/api/V1/insaf/voyage_status/:id', voyage.voyage_status_by_id);
app.get('/api/V1/insaf/voyage', voyage.read);
app.get('/api/V1/insaf/voyage/:id',voyage.read_by_id);
app.put('/api/V1/insaf/voyage/:id', voyage.update);
app.delete('/api/V1/insaf/voyage/:id', voyage.delete_);
// ==========================================================================

// ============================== Noon Position ==============================
app.post('/api/V1/insaf/noon_position/create', noon_position.create);
app.get('/api/V1/insaf/noon_position/read', noon_position.read);
app.get('/api/V1/insaf/noon_position/:id',noon_position.read_by_id);
app.get('/api/V1/insaf/noon_position/read/last', noon_position.read_by_last);
app.get('/api/V1/insaf/noon_position/voyage/:id',noon_position.read_by_voyage);
app.put('/api/V1/insaf/noon_position/update/:id', noon_position.update);
app.delete('/api/V1/insaf/noon_position/delete/:id', noon_position.delete_);
// ==========================================================================

// ============================== Telkompel =================================
app.post('/api/V1/masdex/telkompel', telkompel.create);
app.get('/api/V1/masdex/telkompel', telkompel.read);
app.get('/api/V1/masdex/telkompel/:id', telkompel.read_by_id);
app.put('/api/V1/masdex/telkompel/:id', telkompel.update);
app.delete('/api/V1/masdex/telkompel/:id', telkompel.delete_);
// ==========================================================================

// ============================== Pelabuhan =================================
app.post('/api/V1/masdex/pelabuhan', pelabuhan.create);
app.get('/api/V1/masdex/pelabuhan', pelabuhan.read);
app.get('/api/V1/masdex/pelabuhan/:id', pelabuhan.read_by_id);
app.put('/api/V1/masdex/pelabuhan/:id', pelabuhan.update);
app.delete('/api/V1/masdex/pelabuhan/:id', pelabuhan.delete_);
// ==========================================================================

// ============================== Dermaga =================================
app.post('/api/V1/masdex/dermaga', dermaga.create);
app.get('/api/V1/masdex/dermaga', dermaga.read);
app.get('/api/V1/masdex/dermaga/:id', dermaga.read_by_id);
app.put('/api/V1/masdex/dermaga/:id', dermaga.update);
app.delete('/api/V1/masdex/dermaga/:id', dermaga.delete_);
// ==========================================================================

// ============================== Area Tambat ===============================
app.post('/api/V1/masdex/area_tambat', area_tambat.create);
app.get('/api/V1/masdex/area_tambat', area_tambat.read);
app.get('/api/V1/masdex/area_tambat/:id', area_tambat.read_by_id);
app.put('/api/V1/masdex/area_tambat/:id', area_tambat.update);
app.delete('/api/V1/masdex/area_tambat/:id', area_tambat.delete_);
// ==========================================================================

// ============================== Area Labuh ===============================
app.post('/api/V1/masdex/area_labuh', area_labuh.create);
app.get('/api/V1/masdex/area_labuh', area_labuh.read);
app.get('/api/V1/masdex/area_labuh/:id', area_labuh.read_by_id);
app.put('/api/V1/masdex/area_labuh/:id', area_labuh.update);
app.delete('/api/V1/masdex/area_labuh/:id', area_labuh.delete_);
// ==========================================================================

// ============================== Jenis Berita Master Cable ===============================
app.post('/api/V1/insaf/jenis_berita', jenis_berita.create);
app.get('/api/V1/insaf/jenis_berita', jenis_berita.read);
app.get('/api/V1/insaf/jenis_berita/:id', jenis_berita.read_by_id);
app.put('/api/V1/insaf/jenis_berita/:id', jenis_berita.update);
app.delete('/api/V1/insaf/jenis_berita/:id', jenis_berita.delete_);
// ==========================================================================

// ============================== Jenis Securite ===============================
app.post('/api/V1/insaf/jenis_securite/create', jenis_securite.create);
app.get('/api/V1/insaf/jenis_securite/read', jenis_securite.read);
app.get('/api/V1/insaf/jenis_securite/:id', jenis_securite.read_by_id);
app.put('/api/V1/insaf/jenis_securite/update/:id', jenis_securite.update);
app.delete('/api/V1/insaf/jenis_securite/delete/:id', jenis_securite.delete_);
// ==========================================================================

// ============================== Jenis Informasi Awal Securite ===============================
app.post('/api/V1/insaf/jenis_informasi_securite/create', jenis_informasi_securite.create);
app.get('/api/V1/insaf/jenis_informasi_securite/read', jenis_informasi_securite.read);
app.get('/api/V1/insaf/jenis_informasi_securite/:id', jenis_informasi_securite.read_by_id);
app.put('/api/V1/insaf/jenis_informasi_securite/update/:id', jenis_informasi_securite.update);
app.delete('/api/V1/insaf/jenis_informasi_securite/delete/:id', jenis_informasi_securite.delete_);
// ==========================================================================

// ============================== Jenis Pelanggaran ===============================
app.post('/api/V1/insaf/jenis_pelanggaran/create', jenis_pelanggaran.create);
app.get('/api/V1/insaf/jenis_pelanggaran/read', jenis_pelanggaran.read);
app.get('/api/V1/insaf/jenis_pelanggaran/:id', jenis_pelanggaran.read_by_id);
app.put('/api/V1/insaf/jenis_pelanggaran/update/:id', jenis_pelanggaran.update);
app.delete('/api/V1/insaf/jenis_pelanggaran/delete/:id', jenis_pelanggaran.delete_);
// ==========================================================================

// ============================== Jenis Palayaran ===============================
app.post('/api/V1/masdex/jenis_pelayaran/create', jenis_pelayaran.create);
app.get('/api/V1/masdex/jenis_pelayaran/read', jenis_pelayaran.read);
app.get('/api/V1/masdex/jenis_pelayaran/:id', jenis_pelayaran.read_by_id);
app.put('/api/V1/masdex/jenis_pelayaran/update/:id', jenis_pelayaran.update);
app.delete('/api/V1/masdex/jenis_pelayaran/delete/:id', jenis_pelayaran.delete_);
// ==========================================================================

// ============================== Jenis Terminal ===============================
app.post('/api/V1/masdex/terminal/create', terminal.create);
app.get('/api/V1/masdex/terminal/read', terminal.read);
app.get('/api/V1/masdex/terminal/:id', terminal.read_by_id);
app.put('/api/V1/masdex/terminal/update/:id', terminal.update);
app.delete('/api/V1/masdex/terminal/delete/:id', terminal.delete_);
// ==========================================================================


// ============================== Jenis Pan ===============================
app.post('/api/V1/insaf/jenis_pan/create', jenis_pan.create);
app.get('/api/V1/insaf/jenis_pan/read', jenis_pan.read);
app.get('/api/V1/insaf/jenis_pan/:id', jenis_pan.read_by_id);
app.put('/api/V1/insaf/jenis_pan/update/:id', jenis_pan.update);
app.delete('/api/V1/insaf/jenis_pan/delete/:id', jenis_pan.delete_);
// ==========================================================================

// ============================== Jenis Status Bernavigasi ===============================
app.post('/api/V1/insaf/jenis_status_navigation/create', jenis_status_navigation.create);
app.get('/api/V1/insaf/jenis_status_navigation/read', jenis_status_navigation.read);
app.get('/api/V1/insaf/jenis_status_navigation/:id', jenis_status_navigation.read_by_id);
app.put('/api/V1/insaf/jenis_status_navigation/update/:id', jenis_status_navigation.update);
app.delete('/api/V1/insaf/jenis_status_navigation/delete/:id', jenis_status_navigation.delete_);
// ==========================================================================

// ============================== Jenis Manouvre ===============================
app.post('/api/V1/insaf/jenis_manouvre/create', jenis_manouvre.create);
app.get('/api/V1/insaf/jenis_manouvre/read', jenis_manouvre.read);
app.get('/api/V1/insaf/jenis_manouvre/:id', jenis_manouvre.read_by_id);
app.put('/api/V1/insaf/jenis_manouvre/update/:id', jenis_manouvre.update);
app.delete('/api/V1/insaf/jenis_manouvre/delete/:id', jenis_manouvre.delete_);
// ==========================================================================

// ============================== Jenis Berita Marine Safety Informasi ===============================
app.post('/api/V1/insaf/jenis_berita_marine_safety_informasi/create', jenis_berita_marine_safety_informasi.create);
app.get('/api/V1/insaf/jenis_berita_marine_safety_informasi/read', jenis_berita_marine_safety_informasi.read);
app.get('/api/V1/insaf/jenis_berita_marine_safety_informasi/:id', jenis_berita_marine_safety_informasi.read_by_id);
app.put('/api/V1/insaf/jenis_berita_marine_safety_informasi/update/:id', jenis_berita_marine_safety_informasi.update);
app.delete('/api/V1/insaf/jenis_berita_marine_safety_informasi/delete/:id', jenis_berita_marine_safety_informasi.delete_);
// ==========================================================================

// ============================== Jenis Stakeholder ===============================
app.get('/api/V1/masdex/jenis_stakeholder', jenis_stakeholder.read);
app.get('/api/V1/masdex/jenis_stakeholder/:id', jenis_stakeholder.read_by_id);
app.post('/api/V1/masdex/jenis_stakeholder/', jenis_stakeholder.create);
app.delete('/api/V1/masdex/jenis_stakeholder/:id', jenis_stakeholder.delete_);
app.patch('/api/V1/masdex/jenis_stakeholder/:id', jenis_stakeholder.update);

// ============================== Jenis Kapal ===============================
app.get('/api/V1/masdex/jenis_kapal', jenis_kapal.read);
app.get('/api/V1/masdex/jenis_kapal/:id', jenis_kapal.read_by_id);
app.post('/api/V1/masdex/jenis_kapal/', jenis_kapal.create);
app.delete('/api/V1/masdex/jenis_kapal/:id', jenis_kapal.delete_);
app.patch('/api/V1/masdex/jenis_kapal/:id', jenis_kapal.update);
app.post('/api/V1/masdex/jeniskapalchild/read', jenis_kapal.readShipTypeChild);

// ============================== Spesialisasi Kesehatan ===============================
app.get('/api/V1/masdex/spesialisasi_kesehatan/read', spesialisasi_kesehatan.read);
app.get('/api/V1/masdex/spesialisasi_kesehatan/:id', spesialisasi_kesehatan.read_by_id);
app.post('/api/V1/masdex/spesialisasi_kesehatan/create', spesialisasi_kesehatan.create);
app.delete('/api/V1/masdex/spesialisasi_kesehatan/delete/:id', spesialisasi_kesehatan.delete_);
app.patch('/api/V1/masdex/spesialisasi_kesehatan/update/:id', spesialisasi_kesehatan.update);
// app.post('/api/V1/masdex/jeniskapalchild/read', spesialisasi_kesehatan.readShipTypeChild);

// ============================== Pasien ===============================
app.get('/api/V1/masdex/pasien/read', pasien.read);
app.get('/api/V1/masdex/pasien/:id', pasien.read_by_id);
app.get('/api/V1/masdex/pasien/tmasid/:id', pasien.read_by_tmas);
app.post('/api/V1/masdex/pasien/create', pasien.create);
app.delete('/api/V1/masdex/pasien/delete/:id', pasien.delete_);
app.patch('/api/V1/masdex/pasien/update/:id', pasien.update);

// ============================== Telemedical Assistance Services ===============================
app.get('/api/V1/masdex/tmas/read', tmas.read);
app.get('/api/V1/masdex/tmas/read/all', tmas.readAll);
app.get('/api/V1/masdex/tmas/:id', tmas.read_by_id);
app.post('/api/V1/masdex/tmas/create', tmas.create);
app.delete('/api/V1/masdex/tmas/delete/:id', tmas.delete_);
app.put('/api/V1/masdex/tmas/update/:id', tmas.update);

// status OSC
app.get('/api/V1/masdex/room_tmas/status_osc/:id', tmas.statusOSC);
app.post('/api/V1/masdex/room_tmas/getOSC', tmas.getOSC);


// ship particular chat
app.post('/api/V1/masdex/room_tmas/getShipParticularChat',tmas.getShipParticularChat);
app.get('/api/V1/masdex/room_tmas/getShipParticularChat/:id',tmas.getShipParticularTMAS);

// tmas id
app.post('/api/V1/masdex/room_tmas/get_tmasid_fromchat',tmas.getTMASidbyRoomname);

//end tmas chat
app.put('/api/V1/masdex/room_tmas/end_tmas/:id',tmas.endTMAS);

// participant
app.get('/api/V1/masdex/participant_tmas/insaf/read/:id', tmas.getAllpartisipanByTMASid);
app.post('/api/V1/masdex/room_tmas/create/:id/chatroom', tmas.storePartisipanChatroom);

// ============================== 1.PKK =======================================
app.post('/api/V1/masdex/pkk', pkk.create);
app.post('/api/V1/masdex/pkk-insaf', pkk.createFromInsaf);
app.get('/api/V1/masdex/pkk/notif', pkk.read_new_notif);
app.get('/api/V1/masdex/pkk/:id', pkk.read_by_id);
app.put('/api/V1/masdex/pkk/:id', pkk.update);
app.put('/api/V1/masdex/pkk/notif/:id', pkk.update_read_notif);
app.delete('/api/V1/masdex/pkk/:id', pkk.delete_);
app.get('/api/V1/masdex/voyage/pkk/:id', pkk.read_by_voyage);
// ==========================================================================

// ============================== Notice to Marine =======================================
app.post('/api/V1/insaf/notice_to_marine/create', notice_to_marine.create);
app.get('/api/V1/insaf/notice_to_marine/read', notice_to_marine.read);
app.get('/api/V1/insaf/notice_to_marine/:id', notice_to_marine.read_by_id);
app.get('/api/V1/insaf/notice_to_marine/read/last', notice_to_marine.read_by_last);
app.put('/api/V1/insaf/notice_to_marine/update/:id', notice_to_marine.update);
app.delete('/api/V1/insaf/notice_to_marine/delete/:id', notice_to_marine.delete_);

// Notice to Marine Detail
app.post('/api/V1/insaf/notice_to_marine_detail/create', notice_to_marine.createDetail);
app.get('/api/V1/insaf/notice_to_marine_detail/read', notice_to_marine.readDetail);
app.get('/api/V1/insaf/notice_to_marine_detail/:id', notice_to_marine.read_by_idDetail);
app.get('/api/V1/insaf/notice_to_marine_detail/ntm/:id', notice_to_marine.read_by_ntmDetail);
app.put('/api/V1/insaf/notice_to_marine_detail/update/:id', notice_to_marine.updateDetail);
app.delete('/api/V1/insaf/notice_to_marine_detail/delete/:id', notice_to_marine.deleteDetail);
// ==========================================================================

// ============================== 2.1.Master Cable ==============================
app.post('/api/V1/masdex/master_cable', master_cable.create);
app.get('/api/V1/masdex/master_cable', master_cable.read);
app.get('/api/V1/masdex/master_cable/notif', master_cable.read_new_notif);
app.get('/api/V1/masdex/master_cable/:id', master_cable.read_by_id);
app.get('/api/V1/masdex/master_cable/voyage/:id', master_cable.read_by_voyage_id);
app.get('/api/V1/masdex/voyage/pkk/master_cable/:id', master_cable.read_by_voyage_pkk);
app.get('/api/V1/masdex/voyage/detail/master_cable/:id', master_cable.read_by_voyage_detail);
app.put('/api/V1/masdex/master_cable/:id', master_cable.update);
app.put('/api/V1/masdex/master_cable/notif/:id', master_cable.update_read_notif);
app.delete('/api/V1/masdex/master_cable/:id', master_cable.delete_);

// =============================== Kurs Tengah ==============================
app.get('/api/V1/kurs',master_cable.kurs_tengah_data);
app.get('/api/V1/kurs_tengah', master_cable.kurs_tengah);
// ==========================================================================

// ================================ Total Tagihan ===========================
app.post('/api/V1/total_tagihan/:location', master_cable.cek_total_tagihan);
// ==========================================================================

// ============================== 2.2.Master VTS ==============================
app.post('/api/V1/masdex/master_vts', master_vts.create);
app.get('/api/V1/masdex/master_vts', master_vts.read);
app.get('/api/V1/masdex/master_vts/notif', master_vts.read_new_notif);
app.get('/api/V1/masdex/master_vts/:id', master_vts.read_by_id);
app.get('/api/V1/masdex/master_vts/voyage/:id', master_vts.read_by_voyage_id);
app.get('/api/V1/masdex/voyage/pkk/master_vts/:id', master_vts.read_by_voyage_pkk);
app.get('/api/V1/masdex/voyage/detail/master_vts/:id', master_vts.read_by_voyage_detail);
app.put('/api/V1/masdex/master_vts/:id', master_vts.update);
app.put('/api/V1/masdex/master_vts/notif/:id', master_vts.update_read_notif);
app.delete('/api/V1/masdex/master_vts/:id', master_vts.delete_);

// =============================== Kurs Tengah ==============================
app.get('/api/V1/kurs',master_vts.kurs_tengah_data);
app.get('/api/V1/kurs_tengah', master_vts.kurs_tengah);
// ==========================================================================

// ================================ Total Tagihan ===========================
app.post('/api/V1/total_tagihan/:location', master_vts.cek_total_tagihan);
// ==========================================================================

// ============================== 3.Clearance In ==============================
app.post('/api/V1/insaf/clearance_in', clearance_in.create);
app.get('/api/V1/insaf/clearance_in', clearance_in.read);
app.get('/api/V1/insaf/clearance_in/notif', clearance_in.read_new_notif);
app.get('/api/V1/insaf/clearance_in/:id', clearance_in.read_by_id);
app.get('/api/V1/insaf/clearance_in/voyage/:id', clearance_in.read_by_voyage_id);
app.put('/api/V1/insaf/clearance_in/:id', clearance_in.update);
app.put('/api/V1/masdex/clearance_in/:id', clearance_in.update_ksu);
app.put('/api/V1/insaf/clearance_in/notif/:id', clearance_in.update_read_notif);
app.delete('/api/V1/insaf/clearance_in/:id', clearance_in.delete_);
// ==========================================================================


// ============================== 4.Entering To Port ==========================
app.post('/api/V1/insaf/entering_to_port', entering_to_port.create);
app.get('/api/V1/insaf/entering_to_port', entering_to_port.read);
app.get('/api/V1/insaf/entering_to_port/notif', entering_to_port.read_new_notif);
app.get('/api/V1/insaf/entering_to_port/:id', entering_to_port.read_by_id);
app.get('/api/V1/insaf/entering_to_port/voyage/:id', entering_to_port.read_by_voyage_id);
app.get('/api/V1/insaf/entering_to_port/notif', entering_to_port.read_new_notif);
app.put('/api/V1/insaf/entering_to_port/notif/:id', entering_to_port.update_read_notif);
app.put('/api/V1/insaf/entering_to_port/:id', entering_to_port.update);
app.patch('/api/V1/masdex/entering_to_port/update_by_otority/:id', entering_to_port.update_by_otoritas);
app.delete('/api/V1/insaf/entering_to_port/:id', entering_to_port.delete_);

// ==========================================================================

// ============================== 5.Manouvre ==========================
app.post('/api/V1/masdex/manouvre', manouvre.create);
app.get('/api/V1/masdex/manouvre', manouvre.read);
app.get('/api/V1/masdex/manouvre/notif', manouvre.read_new_notif);
app.get('/api/V1/masdex/manouvre/:id', manouvre.read_by_id);
app.get('/api/V1/masdex/manouvre/voyage/:id', manouvre.read_by_voyage_id);
app.get('/api/V1/insaf/manouvre/notif', manouvre.read_new_notif);
app.put('/api/V1/masdex/manouvre/:id', manouvre.update);
app.put('/api/V1/insaf/manouvre/notif/:id', manouvre.update_read_notif);
app.put('/api/V1/insaf/manouvre/:id', manouvre.update_operator);
app.delete('/api/V1/insaf/manouvre/:id', manouvre.delete_);

// ============================== Alasan Manouvre ==============================
app.post('/api/V1/masdex/alasan_manouvre/create', alasan_manouvre.create);
app.get('/api/V1/masdex/alasan_manouvre/read', alasan_manouvre.read);
app.get('/api/V1/masdex/alasan_manouvre/:id', alasan_manouvre.read_by_id);

app.put('/api/V1/masdex/alasan_manouvre/update/:id', alasan_manouvre.update);
app.delete('/api/V1/masdex/alasan_manouvre/delete/:id', alasan_manouvre.delete_);
// ==========================================================================

// ============================== 6.Clearance Out ==========================
app.post('/api/V1/masdex/clearance_out', clearance_out.create);
app.get('/api/V1/masdex/clearance_out', clearance_out.read);
app.get('/api/V1/masdex/clearance_out/notif', clearance_out.read_new_notif);
app.get('/api/V1/masdex/clearance_out/:id', clearance_out.read_by_id);
app.get('/api/V1/masdex/clearance_out/voyage/:id', clearance_out.read_by_voyage_id);
app.put('/api/V1/masdex/clearance_out/:id', clearance_out.update_ksu);
app.put('/api/V1/insaf/clearance_out/notif/:id', clearance_out.update_read_notif);
app.put('/api/V1/insaf/clearance_out/:id', clearance_out.update_operator);
app.delete('/api/V1/masdex/clearance_out/:id', clearance_out.delete_);
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
app.get('/api/V1/masdex/departing/notif', departing.read_new_notif);
app.get('/api/V1/masdex/departing/:id', departing.show);
app.get('/api/V1/masdex/departing/voyage/:id', departing.show_by_voyage);
app.put('/api/V1/masdex/departing/notif/:id', departing.update_read_notif);
app.patch('/api/V1/masdex/departing/delete/:id', departing.destroy);
app.put('/api/V1/masdex/departing/update/:id', departing.update);
app.patch('/api/V1/masdex/departing/is_departing/:id/:statusdeparting', departing.setStatusdeparting);
app.put('/api/V1/masdex/departing/departing_status/:id', departing.setDepartingStatus);
// ==========================================================================

// =============================== USER =====================================
    app.get('/api/V1/masdex/user/read/internal', user.readinternal);
    app.get('/api/V1/masdex/user/read/eksternal', user_stakeholder.readeksternal);
    app.delete('/api/V1/masdex/user/delete/internal/:id', user.delete_internal);

    app.post('/api/V1/masdex/user', user.create);
    app.get('/api/V1/masdex/user/all', authenticateToken, (req, res) => {
        user.readall(req,res)
    });
    app.get('/api/V1/masdex/user/:id', (req, res) => {
        user.read_by_id(req,res)
    });
    //app.post('/api/V1/masdex/user/login', user.read);
    app.patch('/api/V1/masdex/user/:id', (req, res) => {
        user.update(req,res)
    });
    app.delete('/api/V1/masdex/user/:id',authenticateToken, (req, res) => {
        user.delete_(req,res)
    });
// ==========================================================================
// =============================== LOGIN USER ===============================
    app.post('/api/V1/masdex/user/login',user.login_all);
    app.post('/api/V1/masdex/check_token',user.checkToken);
// ==========================================================================
// =============================== USER STAKEHOLDER =====================================
    app.post('/api/V1/masdex/user_stakeholder', user_stakeholder.create);
    app.get('/api/V1/masdex/user_stakeholder/profile/:id', user_stakeholder.detail_profile);
    app.get('/api/V1/masdex/user_stakeholder/all', authenticateToken, user_stakeholder.readall);
    app.get('/api/V1/masdex/user_stakeholder/nahkoda', authenticateToken, user_stakeholder.read_nahkoda);
    
    app.get('/api/V1/masdex/user_stakeholder/:id', (req, res) => {
        user_stakeholder.read_by_id(req,res)
    });
    //app.post('/api/V1/masdex/user_stakeholder/login', user_stakeholder.read);
    app.patch('/api/V1/masdex/user_stakeholder/:id',authenticateToken, (req, res) => {
        user_stakeholder.update(req,res)
    });
    app.delete('/api/V1/masdex/user_stakeholder/:id',authenticateToken, (req, res) => {
        user_stakeholder.delete_(req,res)
    });
// ==========================================================================

// ================================= STAKEHOLDER ============================
app.post('/api/V1/masdex/stakeholder',authenticateToken, (req, res) => {
    stakeholder.create(req,res);
});
app.get('/api/V1/masdex/stakeholder', authenticateToken, (req, res) => {
    stakeholder.read(req,res);
});
app.get('/api/V1/masdex/stakeholder/:id', authenticateToken, (req, res) => {
    stakeholder.read_by_id(req,res);
});
app.put('/api/V1/masdex/stakeholder/:id', authenticateToken, (req, res) => {
    stakeholder.update(req,res);
});

app.delete('/api/V1/masdex/stakeholder/:id', authenticateToken, (req, res) => {
    stakeholder.delete_(req,res);
});
// ==========================================================================


const info_kapal = require('./info_kapal');
// ============================== Info Kapal ================================
app.get('/api/V1/masdex/kapal_by_perusahaan/:mmsi', authenticateToken, (req, res) => {
    info_kapal.read_kapal_persh_pelayaran_by_mmsi(req,res);
});
app.get('/api/V1/masdex/kapal_by_agen/:mmsi', authenticateToken, (req, res) => {
    info_kapal. read_kapal_agen_kapal_by_mmsi(req,res);
});

app.post('/api/V1/masdex/kapal_by_perusahaan', authenticateToken, (req, res) => {
    info_kapal.read_kapal_persh_pelayaran(req,res);
});
app.post('/api/V1/masdex/kapal_by_agen', authenticateToken, (req, res) => {
    info_kapal.read_kapal_agen(req,res);
});

// ==========================================================================

// ========================== Download Part =================================
    app.get('/api/V1/dokumens/user_stakeholder/:filename', user_stakeholder.download);
    app.get('/api/V1/dokumens/user/:filename', user.download);
    app.get('/api/V1/dokumens/kapal/foto/:filename', kapal.download);
    app.get('/api/V1/dokumens/pkk/:filename', pkk.download);
    app.get('/api/V1/dokumens/jenis_stakeholder/logo/:filename', jenis_stakeholder.download);
    app.get('/api/V1/dokumens/stakeholder/logo/:filename', stakeholder.download);
    app.get('/api/V1/dokumens/clearance_in/:filename', clearance_in.download);
    app.get('/api/V1/dokumens/spog/:filename', manouvre.download);
    app.get('/api/V1/dokumens/clearance_out/:filename', clearance_out.download);
    app.get('/api/V1/dokumens/entering_to_port/dokumen_ppk/:filename', entering_to_port.download_pkk);
    app.get('/api/V1/dokumens/entering_to_port/dokumen_berthing/:filename', entering_to_port.download_berthing);
    app.get('/api/V1/dokumens/ntm/:filename', notice_to_marine.download);
// ==========================================================================

// ============================= Weather Part ===================================
    app.get('/api/weather/bmkg', dbWeathers.getBMKGData);
// ==============================================================================

// ================================= distress ===================================
app.post('/api/V1/masdex/distress/create', distress.createDistress);
app.post('/api/V1/masdex/distress/read', distress.readDistress);
app.get('/api/V1/masdex/distress/read/:id', distress.readDistressByID);
app.get('/api/V1/masdex/distress/voyage/:id', distress.readDistressByVoyage);
app.put('/api/V1/masdex/distress/update/:id', distress.updateDistress);
app.delete('/api/V1/masdex/distress/delete/:id', distress.deleteDistress);

app.post('/api/V1/masdex/distress_detail/insaf/read/all', distress.readDistressDetailAll);
app.post('/api/V1/masdex/distress_detail/insaf/create', distress.createDistressDetail);
app.post('/api/V1/masdex/distress_detail/insaf/read', distress.readDistressDetail);
app.get('/api/V1/masdex/distress_detail/read/:id', distress.readDistressDetailByID);
app.put('/api/V1/masdex/distress_detail/update/:id', distress.updateDistressDetail);
app.delete('/api/V1/masdex/distress_detail/delete/:id', distress.deleteDistressDetail);

app.post('/api/V1/masdex/pelapor_distress/insaf/create', distress.createPelaporDistress);
app.post('/api/V1/masdex/pelapor_distress/insaf/read', distress.readPelaporDistress);
app.get('/api/V1/masdex/pelapor_distress/insaf/read/:id', distress.readPelaporDistressByID);
app.put('/api/V1/masdex/pelapor_distress/insaf/update/:id', distress.updatePelaporDistress);
app.delete('/api/V1/masdex/pelapor_distress/insaf/delete/:id', distress.deletePelaporDistress);

// status OSC
app.get('/api/V1/masdex/room_distress/status_osc/:id', distress.statusOSC);
app.post('/api/V1/masdex/room_distress/getOSC', distress.getOSC);

// ship particular chat
app.post('/api/V1/masdex/room_distress/getShipParticularChat',distress.getShipParticularChat);
app.get('/api/V1/masdex/room_distress/getShipParticularChat/:id',distress.getShipParticularDistress);

// distress id
app.post('/api/V1/masdex/room_distress/getdistressidfromchat',distress.getDistressidbyRoomname);

//end distress chat
app.put('/api/V1/masdex/room_distress/end_distress/:id',distress.endDistress);

// histori chat
app.get('/api/V1/masdex/histori_chat/read/:roomname', histori_chat.read_by_id);
app.get('/api/V1/masdex/histori_chat/read', histori_chat.read);

// participant
app.get('/api/V1/masdex/participant_distress/insaf/read/:distressid', distress.getAllpartisipanBydistressid);
app.post('/api/V1/masdex/room_distress/create/:distressid/chatroom', distress.storePartisipanChatroom);

// jenis distress 
app.get('/api/V1/masdex/jenis_distress/read', distress.getJenisDistress);
// ================================= end distress ===============================

// ================================= contravention =====================================
app.get('/api/V1/insaf/contravention', contravention.read);
app.post('/api/V1/insaf/contravention/create', contravention.create);
app.get('/api/V1/insaf/contravention/:id', contravention.read_by_id);
app.patch('/api/V1/insaf/contravention/update/:id', contravention.update);
app.delete('/api/V1/insaf/contravention/delete/:id', contravention.delete_);


app.get('/api/V1/insaf/contravention/voyage/:id', contravention.read_by_voyage);
app.patch('/api/V1/insaf/contravention/update_ksop/:id', contravention.update_by_ksop);
// =============================== end contravention ===================================

// ================================= pan =====================================
app.get('/api/V1/masdex/pan', pan.getPAN)
app.get('/api/V1/masdex/pan/order/:target', pan.getPANorderBY)
app.post('/api/V1/masdex/pan/create', pan.storePAN)
app.get('/api/V1/masdex/pan/show/:id', pan.getPANbyId)
app.get('/api/V1/masdex/pan/voyage/:id', pan.getPANbyVoyage)
app.get('/api/V1/masdex/pan/show/:range1/:range2', pan.getPANByRange)
app.put('/api/V1/masdex/pan/update/:id', pan.updatePAN)
app.delete('/api/V1/masdex/pan/destroy/:id', pan.destroyPAN)
app.delete('/api/V1/masdex/pan/destroy_all/:id', pan.destroyPANandDetailPAN)
app.get('/api/V1/masdex/pan/search/:keyword', pan.searchPANdata)
app.get('/api/V1/masdex/pan/latest', pan.getLatestPAN)
app.get('/api/V1/masdex/pan/sumberinformasiawal', pan.getSumberInformasiAwal)
app.get('/api/V1/masdex/pan/jenispan', pan.getJenisPan)

app.get('/api/V1/masdex/pan_detail', pan.getPANdetailAll)
app.get('/api/V1/masdex/pan_detail/:id', pan.getPANdetail)
app.post('/api/V1/masdex/pan_detail/store/:id', pan.storePANdetail)
app.get('/api/V1/masdex/pan_detail/show/:pan_id/:pan_detail_id', pan.getPANdetailbyId)
app.get('/api/V1/masdex/pan_detail/edit_by_pan_id/:pan_detail_id', pan.getPANdetailbyPANId)
app.get('/api/V1/masdex/pan_detail/show_by_pan_id/:pan_detail_id', pan.showPANdetailByPANid)
app.put('/api/V1/masdex/pan_detail/update/:pan_id/:pan_detail_id', pan.updatePANdetail)
app.delete('/api/V1/masdex/pan_detail/destroy/:pan_id/:pan_detail_id', pan.destroyPANdetail)
// ===========================================================================
app.post('/api/V1/securite/create', securite.createSecurite)
app.post('/api/V1/securitedetail/create', securite.createSecuriteDetail)
app.post('/api/V1/securite/read', securite.getSecurite)
app.get('/api/V1/securite/read/:id', securite.getSecuriteById)
app.get('/api/V1/securite/voyage/:id', securite.getSecuriteByVoyage)
app.get('/api/V1/securite/read_detail/:id', securite.getSecuriteDetailById)
app.post('/api/V1/securite/read/range', securite.getSecuriteByRange)
app.delete('/api/V1/securite/delete/:id', securite.deleteSecurite)
app.delete('/api/securitedetail/insaf/delete/:id', securite.deleteSecuriteDetail)
app.put('/api/V1/securite/update/:id', securite.updateSecurite)
app.get('/api/V1/securite/read_resume/:id', securite.getSecuriteResumeById)
// ============================ END SECURITE (INSAF) =====================================

// ============================ MSI (INSAF) =====================================
app.post('/api/V1/msi/create', msi.createMSI)
app.post('/api/V1/msidetail/create', msi.createMSIDetail)
app.post('/api/V1/msi/read', msi.getMSI)
app.post('/api/V1/msi/read/last', msi.getMSILast)
app.get('/api/V1/msi/read/:id', msi.getMSIById)
app.get('/api/V1/msi/read_detail/:id', msi.getMSIDetailById)
app.delete('/api/V1/msi/delete/:id', msi.deleteMSI)
app.delete('/api/V1/msi/delete_msi_detail/:id', msi.deleteMSIDetail)
app.delete('/api/V1/msi/delete_msi_detail_parent/:id', msi.deleteMSIDetailByIdParent)
app.delete('/api/V1/msi/delete_msi_detail_permanent/:id', msi.deleteMSIDetailPermanent)
app.put('/api/V1/msi/update/:id', msi.updateMSI)
app.put('/api/V1/msi/update_msi_detail/:id', msi.updateMSIDetail)

// jenis berita msi
app.post('/api/V1/jenismsi/read', msi.readJenisMSI)
// ============================ END MSI (INSAF) =====================================

app.get('/api/V1/masdex/jenis_distress', jenis_distress.read);
app.post('/api/V1/insaf/jenis_distress/create', jenis_distress.create);
app.get('/api/V1/insaf/jenis_distress/:id', jenis_distress.read_by_id);
app.put('/api/V1/insaf/jenis_distress/update/:id', jenis_distress.update);
app.delete('/api/V1/insaf/jenis_distress/delete/:id', jenis_distress.delete_);
// ================================= end jenis distress ===============================

// ================================= jenis distress ===================================
app.get('/api/V1/masdex/sumber_informasi', sumber_informasi.read);
// ================================= end jenis distress ===============================
// authentification part======================================================
// authentification part======================================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
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
        message: "🚀 API Masdex v2.0"
    });
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
