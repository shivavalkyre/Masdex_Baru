const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')


const createSecurite = (request, response) => {
  const { no_jurnal, tgl_jurnal, jenis_securite, waktu_kejadian, sumber_info, ket_lainnya, mmsi, status_nav, info_tambahan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, lokasi_terlapor, degree3, minute3, second3, direction3, degree4, minute4, second4, direction4, pelabuhan_asal, pelabuhan_tujuan, desc_securite, memerlukan_tindakan, mob, nohp1, secc_officer, nohp2, deskripsi_tindakan,voyage_id } 
  = request.body
  pool.query('INSERT INTO tbl_insaf_securite (no_jurnal, tanggal, jenis_securite, waktu_kejadian, sumber_informasi_awal, keterangan_lainnya, mmsi, status_navigasi, info_tambahan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, lokasi_terlapor, degree3, minute3, second3, direction3, degree4, minute4, second4, direction4, pelabuhan_asal, pelabuhan_tujuan, descripsi_securite, memerlukan_tindakan, master_onboard, nohp1, seccond_officer, nohp2, deskripsi_tindakan,voyage_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)'
  , [no_jurnal, "'"+tgl_jurnal+"'", jenis_securite, "'"+waktu_kejadian+"'", sumber_info, ket_lainnya, mmsi, status_nav, info_tambahan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, lokasi_terlapor, degree3, minute3, second3, direction3, degree4, minute4, second4, direction4, pelabuhan_asal, pelabuhan_tujuan,desc_securite, memerlukan_tindakan, mob, nohp1, secc_officer, nohp2, deskripsi_tindakan,voyage_id], (error, results) =>{
    if (error) {
      throw error
      //response.status(201).send(error)
      if (error.code == '23505')
      {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
      }
    }
    else
    {
      pool.query('SELECT id FROM tbl_insaf_securite ORDER BY id DESC limit 1', (error1, results1) => {
        if (error1) {
          throw error1
        }
        else{
          var myid = results1.rows[0].id;
        }

        response.status(200).send({status:true,data:`Added Securite Successfuly !`, last_id: myid})
      })
    }
  })
}

const createSecuriteDetail = (request, response) => {
  const { securite_id, nama_pelapor, tgl_lapor, info_tambahan, instansi, kontak, created_by } 
  = request.body
  pool.query('INSERT INTO tbl_insaf_securite_detail (securite_id, nama_pelapor, tgl_lapor, info_tambahan, instansi, kontak, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)'
  , [securite_id, nama_pelapor, tgl_lapor, info_tambahan, instansi, kontak, created_by], (error, results) =>{
    if (error) {
      // throw error
      response.status(201).send(error)
      if (error.code == '23505')
      {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(201).send({status:false,data:`Duplicate Data`})
          return;
      }
    }
    else
    {
      response.status(200).send({status:true,data:`Added Securite Detail Successfuly !`})
    }      
  })
}


  
const getSecurite = (request, response) => {
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_insaf_securite', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({total:results.rows[0].total})

  //  var sql= 'SELECT s.*, d.id id_detail, d.securite_id securite_id, d.nama_pelapor nama_pelapor, d.tgl_lapor tgl_lapor, d.info_tambahan info_tambahan FROM tbl_insaf_securite s INNER JOIN tbl_insaf_securite_detail d ON s.id = d.securite_id ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
  //  var sql= 'SELECT * from insaf_securitexsecuritedetail ORDER BY id DESC LIMIT '  + rows_req + ' OFFSET ' + offset
    var sql= 'SELECT * from tbl_insaf_securite WHERE is_delete = false'
    // var sql= 'SELECT * from insaf_securitexsecuritedetails'
    pool.query(sql ,(error, results) => {
      if (error) {
        throw error
      }
      items.push({rows:results.rows})
      res.push(items)
      //response.status(200).send({success:true,data:res})
      response.status(200).send(res)
    })

  })


}


const getSecuriteById = (request, response) => {
  const id = parseInt(request.params.id)
  // response.status(200).json(id)
  // pool.query('SELECT s.*, d.id id_detail, d.securite_id securite_id, d.nama_pelapor nama_pelapor, d.tgl_lapor tgl_lapor, d.info_tambahan info_tambahan FROM tbl_insaf_securite s INNER JOIN tbl_insaf_securite_detail d ON s.id = d.securite_id WHERE s.id = $1', [id], (error, results) =>  { 
  pool.query('SELECT * FROM tbl_insaf_securite WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSecuriteDetailById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT id,nama_pelapor,kontak_pelapor,instansi_pelapor,tanggal_lapor,info_tambahan_pelapor FROM insaf_securite_detail WHERE securite_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({status:true,data:results.rows})
  })
}

const getSecuriteResumeById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT  * FROM insaf_securite_resume WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })

}

const getSecuritePelaporById = (request, response) => {
  const id = parseInt(request.params.id)

}

const getSecuriteByRange = (request, response) => {
  const {range1,range2} = request.body
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []
  
  
  // var sql= 'SELECT COUNT(*) as total FROM insaf_securiterange WHERE waktu_kejadian >='+ " '"+range1 +"'"+ ' AND waktu_kejadian <= '+ "'"+range2+"'" +' LIMIT ' + rows_req + ' OFFSET ' + offset
  var sql= 'SELECT COUNT(*) as total FROM insaf_securiterange WHERE waktu_kejadian >='+ " '"+range1 +"'"+ ' AND waktu_kejadian <= '+ "'"+range2+"'" 
  pool.query(sql ,(error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({total:results.rows[0].total})

  //  var sql= 'SELECT * FROM insaf_securiterange WHERE waktu_kejadian >='+ " '"+range1 +"'"+ ' AND waktu_kejadian <= '+ "'"+range2+"'" +' ORDER BY id ASC LIMIT ' + rows_req + ' OFFSET ' + offset
    var sql= 'SELECT * FROM insaf_securiterange WHERE waktu_kejadian >='+ " '"+range1 +"'"+ ' AND waktu_kejadian <= '+ "'"+range2+"'" +' ORDER BY id ASC'
  // console.log(sql)
    pool.query(sql ,(error, results) => {
      if (error) {
        throw error
      }
      items.push({rows:results.rows})
      res.push(items)
      //response.status(200).send({success:true,data:res})
      response.status(200).send(res)
    })

  })


}


const updateSecurite = (request,response) => {
const id = parseInt(request.params.id)
const { no_jurnal, tgl_jurnal, jenis_securite, waktu_kejadian, sumber_informasi_awal, keterangan_lainnya, mmsi, status_bernavigasi, info_tambahan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, lokasi_terlapor, degree3, minute3, second3, direction3, degree4, minute4, second4, direction4, pelabuhan_asal, pelabuhan_tujuan, deskripsi_laporan_securite, memerlukan_tindakan, deskripsi_tindakan,mob, nohp1, second_officer, nohp2,voyage_id } = request.body
var updated_at = new Date()
//console.log(sumber_informasi_awal);
//console.log(no_jurnal+","+ tgl_jurnal+","+ jenis_securite+","+ waktu_kejadian+"," + sumber_informasi_awal +"," +keterangan_lainnya+"," +mmsi+","+ status_bernavigasi +","+ info_tambahan+","+ degree1+","+ minute1+","+ second1+","+ direction1+","+ degree2+","+ minute2+","+ second2+","+ direction2+","+ lokasi_terlapor+","+ degree3+","+ minute3+","+ second3+","+ direction3+","+ degree4+","+ minute4+","+ second4+","+ direction4+","+ pelabuhan_asal+","+ pelabuhan_tujuan+","+ deskripsi_laporan_securite+","+memerlukan_tindakan+","+ mob+","+ nohp1+","+ second_officer+","+ nohp2,deskripsi_tindakan);
pool.query(
  'UPDATE tbl_insaf_securite SET no_jurnal = $1, tanggal = $2, jenis_securite = $3, waktu_kejadian = $4, sumber_informasi_awal = $5, keterangan_lainnya = $6, mmsi = $7, status_navigasi = $8, informasi_tambahan = $9, degree1 = $10, minute1 = $11, second1 = $12, direction1 = $13, degree2 = $14, minute2 = $15, second2 = $16, direction2 = $17, lokasi_terlapor = $18, degree3 = $19, minute3 = $20, second3 = $21, direction3 = $22, degree4 = $23, minute4 = $24, second4 = $25, direction4 = $26, pelabuhan_asal = $27, pelabuhan_tujuan = $28, descripsi_securite = $29, memerlukan_tindakan = $30, master_onboard = $31, nohp1 = $32, seccond_officer = $33, nohp2 = $34, updated_at = $35,deskripsi_tindakan=$36,voyage_id=$37 WHERE id = $38',
  [no_jurnal, tgl_jurnal, jenis_securite, waktu_kejadian, sumber_informasi_awal, keterangan_lainnya, mmsi, status_bernavigasi, info_tambahan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, lokasi_terlapor, degree3, minute3, second3, direction3, degree4, minute4, second4, direction4, pelabuhan_asal, pelabuhan_tujuan, deskripsi_laporan_securite, memerlukan_tindakan, mob, nohp1, second_officer, nohp2, updated_at,deskripsi_tindakan,voyage_id,id],(error, results) => {
    if (error) {
      throw error
    }

    response.status(200).send({status:true,data:`User modified with ID: ${id}`})

  })
  //response.status(200).send({status:true,data:`User modified with ID: ${id}`})
}



const updateSecuriteDetail = (request,response) => {
  const id = parseInt(request.params.id)
  const {nama_pelapor, tgl_pelapor, info_tambahan_p } = request.body
  var updated_at = new Date()
  pool.query(    
    'UPDATE tbl_insaf_securite_detail SET nama_pelapor = $1, tgl_lapor = $2, info_tambahan = $3, updated_at = $4 WHERE id = $5',
      [nama_pelapor, tgl_pelapor, info_tambahan_p, updated_at, id],
      (error1, results) => {
        if (error1) {
          throw error1
        }

        response.status(200).send({status:true,data:`User modified with ID: ${id}`})

      }
      
      
    )

}

const deleteSecurite = (request, response) => {
  const id = parseInt(request.params.id)
  // response.status(200).json(id)
  pool.query('UPDATE tbl_insaf_securite SET is_delete = true WHERE id = $1 ', [id], (error, results) =>  { 
  // pool.query('SELECT * FROM tbl_insaf_securite WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    
    response.status(200).json({status:true, data:`Securite Has Been Deleted with ID: ${id}`})
  })
}

const deleteSecuriteDetail = (request, response) => {
  const id = parseInt(request.params.id)
  // response.status(200).json(id)
  pool.query('UPDATE tbl_insaf_securite_detail SET is_delete= true  WHERE  id = $1 ', [id], (error, results) =>  { 
  
    if (error) {
      throw error
    }
    
    response.status(200).json({status:true, data:results.rows})
  })
}


module.exports = {
  createSecurite,
  createSecuriteDetail,
  getSecurite,
  getSecuriteById,
  getSecuriteDetailById,
  getSecuriteResumeById,
  getSecuriteByRange,
  updateSecurite,
  updateSecuriteDetail,
  deleteSecurite,
  deleteSecuriteDetail
}