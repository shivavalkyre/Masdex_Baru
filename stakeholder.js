const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var complete_path = '';
var password_hash;


const create = (request, response) => {
  const { jenis_stakeholder, user_id, nama_lengkap, alamat_kantor, logo, npwp, telepon_kantor, unit_kantor }
    = request.body;

  pool.query('SELECT Count(*) as total FROM tbl_stakeholders WHERE user_id = $1', [user_id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows[0].total > 0) {
      response.status(400).json({ success: false, data: "data sudah ada" });
    } else {
      // user not exist

      let sampleFile = request.files.logo;
      console.log(sampleFile);
      const now = Date.now()
      let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
      complete_path = base_url + 'dokumens/stakeholder/logo/' + name;
      console.log(__dirname);
      sampleFile.mv(path.join(__dirname + '/dokumens/stakeholder/logo/') + name, function (err) {
        if (err)
          console.log(err);
      });

      pool.query('INSERT INTO tbl_stakeholders (jenis_stakeholder,user_id,nama_lengkap,alamat_kantor,logo,npwp,telepon_kantor,unit_kantor,url_logo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', [jenis_stakeholder, user_id, nama_lengkap, alamat_kantor, name, npwp, telepon_kantor, unit_kantor, complete_path], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send({ success: true, data: 'data stakeholder berhasil ditambah' })

      });
    }
  });

}

const read = (request, response) => {

  const { page, rows } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_stakeholders where is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({ total: results.rows[0].total })

    var sql = 'SELECT * FROM tbl_stakeholders JOIN tbl_jenis_stakeholder ON tbl_stakeholders.jenis_stakeholder = tbl_jenis_stakeholder.id WHERE tbl_stakeholders.is_delete=false AND tbl_jenis_stakeholder.is_delete=false ORDER BY tbl_stakeholders.id ASC'
    pool.query(sql, (error, results) => {
      if (error) {
        throw error
      }
      items.push({ rows: results.rows })
      res.push(items)
      response.status(200).send({ success: true, data: res })
    })

  })

}


const read_by_id = (request, response) => {
  const id = parseInt(request.params.id);
  const { page, rows } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_stakeholders where is_delete=false and id=$1', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({ total: results.rows[0].total })

    var sql = 'SELECT * FROM tbl_stakeholders where is_delete=false and id=$1 ORDER BY id ASC'
    pool.query(sql, [id], (error, results) => {
      if (error) {
        throw error
      }
      items.push({ rows: results.rows })
      res.push(items)
      response.status(200).send({ success: true, data: res })
    })

  })

}


const update = (request, response) => {
  const id = parseInt(request.params.id);
  const { jenis_stakeholder, user_id, nama_lengkap, alamat_kantor, logo, npwp, telepon_kantor, unit_kantor }
    = request.body;
  let doc;
  //console.log(mmsi);
  let jenis_telkompel;

  pool.query('SELECT count(*) as total FROM tbl_stakeholders where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows[0].total);
      pool.query('SELECT * FROM tbl_stakeholders where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }
        console.log(results.rows[0].logo);
        doc = results.rows[0].logo;
        var doc_path = __dirname + path.join('/dokumens/stakeholder/logo/' + doc);
        console.log(doc_path);

        if (fs.existsSync(doc_path)) {
          fs.unlinkSync(doc_path);
        }

        console.log(doc_path);

        let sampleFile = request.files.logo;
        console.log(sampleFile);
        const now = Date.now()
        let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
        complete_path = base_url + 'dokumens/stakeholder/logo/' + name;
        console.log(__dirname);
        sampleFile.mv(path.join(__dirname + '/dokumens/stakeholder/logo/') + name, function (err) {
          if (err) {
            console.log(err);
          }

        });

        console.log(name);
        const update_time = new Date;
        pool.query('UPDATE tbl_stakeholders SET jenis_stakeholder=$1,user_id=$2,nama_lengkap=$3,alamat_kantor=$4,logo=$5,npwp=$6,telepon_kantor=$7,unit_kantor=$8,updated_at=$9,url_logo=$10 where id=$11'
          , [jenis_stakeholder, user_id, nama_lengkap, alamat_kantor, name, npwp, telepon_kantor, unit_kantor, update_time, complete_path, id], (error, results) => {
            if (error) {
              throw error
              //response.status(201).send(error)
              //console.log(error);
            } else {
              response.status(200).send({ success: true, data: 'data stakeholder berhasil diperbarui' })
            }

          });

      });
    }
  });
}

const delete_ = (request, response) => {
  const id = parseInt(request.params.id);


  pool.query('SELECT count(*) as total FROM tbl_stakeholders where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })

  pool.query('SELECT * FROM tbl_stakeholders where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }


    const deletetime = new Date;
    pool.query('UPDATE tbl_stakeholders SET deleted_at=$1,is_delete=$2 where id=$3'
      , [deletetime, true, id], (error, results) => {
        if (error) {

          if (error.code == '23505') {
            //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
            response.status(400).send('Duplicate data')
            return;
          }
        } else {
          response.status(200).send({ success: true, data: 'data stakeholder berhasil dihapus' })
        }

      })




  });


}


const download = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/stakeholder/logo/' + filename);
  console.log(doc_path);
  response.download(doc_path);
};

module.exports = {
  create,
  read,
  read_by_id,
  update,
  delete_,
  download,
}