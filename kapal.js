const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
var complete_path='';
var complete_path_v2='';

const create = (request, response) => {
  const {
    stakeholder_id,
    ship_name,
    gt,
    mmsi,
    imo,
    callsign,
    flag,
    max_draft,
    length,
    width,
    loa,
    ship_type,
    more_information,
    foto_kapal,
    url_foto_kapal,
    dokumen_kapal,
    url_dokumen_kapal
  } = request.body

  var name = '';
  if (request.files.foto_kapal) {
      let sampleFile = request.files.foto_kapal;
      console.log(sampleFile);
      const now = Date.now()
      name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
      complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/kapal/foto/' + name;
      console.log(__dirname+' ini dirname');
      sampleFile.mv(path.join(__dirname + '/dokumens/kapal/foto/') + name, function (err) {
          if (err)
              console.log(err);
      });
  }
  
  var name_v2 = '';
  if (request.files.dokumen_kapal) {
      let sampleFile = request.files.dokumen_kapal;
      console.log(sampleFile);
      const now = Date.now()
      name_v2 = now + '_' + sampleFile['name'].replace(/\s+/g, '')
      complete_path_v2 = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/kapal/foto/' + name_v2;
      console.log(__dirname+' ini dirname');
      sampleFile.mv(path.join(__dirname + '/dokumens/kapal/foto/') + name_v2, function (err) {
          if (err)
              console.log(err);
      });
  }


  pool.query('INSERT INTO tbl_masdex_kapal (stakeholder_id,ship_name,gt,mmsi,imo,call_sign,flag,max_draft,length,width,loa,ship_type,foto_kapal,url_foto_kapal,dokumen_kapal,url_dokumen_kapal,more_information) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)', [stakeholder_id, ship_name, gt, mmsi, imo, callsign, flag, parseFloat(max_draft), length, width, loa, parseInt(ship_type), name, complete_path, name_v2, complete_path_v2, more_information], (error, results) => {

    if (error) {
      throw error
      response.status(201).send(error)
      if (error.code == '23505') {
        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
        response.status(400).send('Duplicate data')
        return;
      }
    } else {
      response.status(200).send({
        success: true,
        data: 'data kapal berhasil dibuat'
      })
    }
  })
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


  pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_masdex_kapal where is_delete=false ORDER BY id DESC'
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
  //console.log('Here');
  //console.log(id);
  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_masdex_kapal where id=$1 and is_delete=false'
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

const read_by_mmsi = (request, response) => {

  const mmsi = parseInt(request.params.mmsi);
  //console.log('Here');
  //console.log(id);
  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where mmsi=$1 and is_delete=false', [mmsi], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_masdex_kapal where mmsi=$1 and is_delete=false'
    pool.query(sql, [mmsi], (error, results) => {
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
    stakeholder_id,
    ship_name,
    gt,
    mmsi,
    imo,
    callsign,
    flag,
    max_draft,
    length,
    width,
    loa,
    ship_type,
    more_information,
    foto_kapal,
    url_foto_kapal,
    dokumen_kapal,
    url_dokumen_kapal
  } = request.body;
  let doc;

  pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })



  pool.query('SELECT * FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    
    var name;
    var complete_path;

    name = results.rows[0].foto_kapal;
    complete_path = results.rows[0].url_foto_kapal;

    if (request.files.foto_kapal) {
        var name = '';
        let sampleFile = request.files.foto_kapal;
        console.log(sampleFile);
        const now = Date.now()
        name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
        complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/kapal/foto/' + name;
        console.log(__dirname);
        sampleFile.mv(path.join(__dirname + '/dokumens/kapal/foto/') + name, function (err) {
            if (err)
                console.log(err);
        });
    }
    
    var name_v2;
    var complete_path_v2;

    name_v2 = results.rows[0].dokumen_kapal;
    complete_path_v2 = results.rows[0].url_dokumen_kapal;

    if (request.files.dokumen_kapal) {
        var name_v2 = '';
        let sampleFile = request.files.dokumen_kapal;
        console.log(sampleFile);
        const now = Date.now()
        name_v2 = now + '_' + sampleFile['name'].replace(/\s+/g, '')
        complete_path_v2 = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/kapal/foto/' + name_v2;
        console.log(__dirname);
        sampleFile.mv(path.join(__dirname + '/dokumens/kapal/foto/') + name_v2, function (err) {
            if (err)
                console.log(err);
        });
    }

    console.log(name);
    const update_time = new Date;
    pool.query('UPDATE tbl_masdex_kapal SET stakeholder_id=$1,ship_name=$2,gt=$3,mmsi=$4,imo=$5,call_sign=$6,flag=$7,max_draft=$8,length=$9,width=$10,loa=$11,ship_type=$12,foto_kapal=$13,updated_at=$14,more_information=$16,url_foto_kapal=$17, dokumen_kapal=$18, url_dokumen_kapal=$19 where id=$15', [stakeholder_id, ship_name, gt, mmsi, imo, callsign, flag, parseFloat(max_draft), parseFloat(length), parseFloat(width), loa, parseInt(ship_type), name, update_time, id, more_information, complete_path, name_v2, complete_path_v2], (error, results) => {
      if (error) {
        throw error
        //response.status(201).send(error)
        //console.log(error);
        if (error.code == '23505') {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      } else {
        response.status(200).send({
          success: true,
          data: 'data kapal berhasil diperbarui'
        })
      }

    })


  });



}

const delete_ = (request, response) => {
  const id = parseInt(request.params.id);


  pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })

  pool.query('SELECT * FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }


    const deletetime = new Date;
    pool.query('UPDATE tbl_masdex_kapal SET deleted_at=$1,is_delete=$2 where id=$3', [deletetime, true, id], (error, results) => {
      if (error) {

        if (error.code == '23505') {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      } else {
        response.status(200).send({
          success: true,
          data: 'data kapal berhasil dihapus'
        })
      }

    })




  });




}



const download = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/kapal/foto/' + filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
};

module.exports = {
  create,
  read,
  read_by_id,
  read_by_mmsi,
  update,
  delete_,
  download
}