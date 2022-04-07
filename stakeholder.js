const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var complete_path = '';
var password_hash;


const create = (request, response) => {
  const {
    jenis_stakeholder,
    nama_lengkap,
    alamat_kantor,
    logo,
    npwp,
    telepon_kantor,
    unit_kantor,
    more_information,
    email_company
  } = request.body;

  // user not exist

  // user not exist
  let name = 'default.jpg'
  let complete_path = base_url + 'dokumens/stakeholder/logo/' + name


  if (request.files!==null) {
    let sampleFile = request.files.logo;
    console.log(sampleFile);
    const now = Date.now()
    name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
    complete_path = base_url + 'dokumens/stakeholder/logo/' + name;
    console.log(__dirname);
    sampleFile.mv(path.join(__dirname + '/dokumens/stakeholder/logo/') + name, function (err) {
      if (err)
        console.log(err);
    });
  }else
  {
    name = null;
    complete_path=null;
  }

  pool.query('INSERT INTO tbl_stakeholders (jenis_stakeholder,nama_lengkap,alamat_kantor,logo,npwp,telepon_kantor,unit_kantor,url_logo,email_company,more_information) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [jenis_stakeholder, nama_lengkap, alamat_kantor, name, npwp, telepon_kantor, unit_kantor, complete_path, email_company, more_information], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send({
      success: true,
      data: 'data stakeholder berhasil ditambah'
    })

  });

}

const read = (request, response) => {

  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_stakeholders where jenis_stakeholder<> 5 and jenis_stakeholder<>6 and is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT tbl_stakeholders.id, tbl_stakeholders.nama_lengkap, tbl_stakeholders.alamat_kantor, tbl_stakeholders.telepon_kantor, tbl_jenis_stakeholder.stakeholder, tbl_stakeholders.jenis_stakeholder FROM tbl_stakeholders JOIN tbl_jenis_stakeholder ON tbl_stakeholders.jenis_stakeholder = tbl_jenis_stakeholder.id WHERE tbl_stakeholders.is_delete=false ORDER BY tbl_stakeholders.id DESC'
    pool.query(sql, (error, results) => {
      if (error) {
        throw error
      }
      items.push({
        rows: results.rows
      })
      res.push(items)
      response.status(200).send({
        success: true,
        data: res
      })
    })

  })

}


const read_by_id = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    page,
    rows
  } = request.body
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
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_stakeholders where is_delete=false and id=$1 ORDER BY id DESC'
    pool.query(sql, [id], (error, results) => {
      if (error) {
        throw error
      }
      items.push({
        rows: results.rows
      })
      res.push(items)
      response.status(200).send({
        success: true,
        data: res
      })
    })

  })

}


const update = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    jenis_stakeholder,
    nama_lengkap,
    alamat_kantor,
    logo,
    npwp,
    telepon_kantor,
    unit_kantor,
    email_company,
    more_information
  } = request.body;
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
        let name, complete_path, doc

        name = results.rows[0].logo;
        complete_path = results.rows[0].url_logo;

        if (request.files) {
          // doc = results.rows[0].logo;
          // if (doc != 'default.jpg') {
          //   var doc_path = __dirname + path.join('/dokumens/stakeholder/logo/' + doc);
          //   console.log(doc_path);
          //   if (fs.unlinkSync(doc_path)){
          //     fs.unlink(doc_path);
          //   }
          //   //fs.unlinkSync();
          //   console.log(doc_path);
          // }

          let sampleFile = request.files.logo;
          console.log(sampleFile);
          const now = Date.now()
          name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
          complete_path = base_url + 'dokumens/stakeholder/logo/' + name;
          console.log('dirname' + __dirname);
          sampleFile.mv(path.join(__dirname + '/dokumens/stakeholder/logo/') + name, function (err) {
            if (err)
              console.log(err);
          });
        }else{
          name=null;
          complete_path=null;
        }

        console.log(name);
        const update_time = new Date;
        pool.query('UPDATE tbl_stakeholders SET jenis_stakeholder=$1,nama_lengkap=$2,alamat_kantor=$3,logo=$4,npwp=$5,telepon_kantor=$6,unit_kantor=$7,email_company=$8,updated_at=$9,url_logo=$10,more_information=$12 where id=$11', [jenis_stakeholder, nama_lengkap, alamat_kantor, name, npwp, telepon_kantor, unit_kantor, email_company, update_time, complete_path, id, more_information], (error, results) => {
          if (error) {
            throw error
            //response.status(201).send(error)
            //console.log(error);
          } else {
            response.status(200).send({
              success: true,
              data: 'data stakeholder berhasil diperbarui'
            })
          }

        });

      });

    }
  })
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
    pool.query('UPDATE tbl_stakeholders SET deleted_at=$1,is_delete=$2 where id=$3', [deletetime, true, id], (error, results) => {
      if (error) {

        if (error.code == '23505') {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      } else {
        response.status(200).send({
          success: true,
          data: 'data stakeholder berhasil dihapus'
        })
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