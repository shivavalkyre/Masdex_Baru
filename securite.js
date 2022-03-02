const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')


const createSecurite = (request, response) => {
  const { jenis_securite ,waktu_kejadian ,sumber_informasi_awal ,info_tambahan ,mmsi ,status_navigasi ,lokasi_terlapor ,degree1 ,minute1 ,second1 ,direction1 ,degree2 ,minute2 ,second2 ,direction2 ,descripsi_securite ,keterangan_pertolongan ,master_onboard ,nohp1 ,second_officer ,nohp2 , title, pelabuhan_asal, pelabuhan_tujuan} 
  = request.body
  pool.query('INSERT INTO tbl_insaf_securite (jenis_securite ,waktu_kejadian ,sumber_informasi_awal ,info_tambahan ,mmsi ,status_navigasi ,lokasi_terlapor ,degree1 ,minute1 ,second1 ,direction1 ,degree2 ,minute2 ,second2 ,direction2 ,descripsi_securite ,keterangan_pertolongan ,master_onboard ,nohp1 ,seccond_officer ,nohp2 , title, pelabuhan_asal, pelabuhan_tujuan) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)'
  , [jenis_securite ,waktu_kejadian ,sumber_informasi_awal ,info_tambahan ,mmsi ,status_navigasi ,lokasi_terlapor ,degree1 ,minute1 ,second1 ,direction1 ,degree2 ,minute2 ,second2 ,direction2 ,descripsi_securite ,keterangan_pertolongan ,master_onboard ,nohp1 ,second_officer ,nohp2 ,title ,pelabuhan_asal ,pelabuhan_tujuan], (error, results) =>{
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
      pool.query('SELECT id FROM tbl_insaf_securite ORDER BY id DESC LIMIT 1',  (error, results) => {
          if (error) 
          {
              throw error
          }
          response.status(200).send({success:true,data: results.rows[0].id})
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
    var sql= 'SELECT s.*, js.jenis_securite, ji.jenis_informasi_securite from tbl_insaf_securite s left join tbl_insaf_jenis_securite js on js.id = s.jenis_securite left join tbl_insaf_jenis_informasi_securite ji on ji.id = s.sumber_informasi_awal WHERE s.is_delete = false'
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
  pool.query('SELECT s.*, pa.nama_pelabuhan as last_port, pl.nama_pelabuhan as next_port, m.ship_name, m.imo, m.call_sign, m.flag, ji.jenis_informasi_securite, js.jenis_securite FROM tbl_insaf_securite s left join tbl_masdex_pelabuhan pa on pa.id = s.pelabuhan_asal left join tbl_masdex_pelabuhan pl on pl.id = s.pelabuhan_tujuan  left join tbl_masdex_kapal m on s.mmsi = m.mmsi left join tbl_insaf_jenis_informasi_securite ji on ji.id = s.sumber_informasi_awal left join tbl_insaf_jenis_securite js on js.id = s.jenis_securite WHERE s.id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSecuriteDetailById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT s.* FROM tbl_insaf_securite_detail s WHERE s.securite_id = $1', [id], (error, results) => {
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
  const { jenis_securite ,waktu_kejadian ,sumber_informasi_awal ,info_tambahan ,mmsi ,status_navigasi ,lokasi_terlapor ,degree1 ,minute1 ,second1 ,direction1 ,degree2 ,minute2 ,second2 ,direction2 ,descripsi_securite ,keterangan_pertolongan ,master_onboard ,nohp1 ,second_officer ,nohp2 , title, pelabuhan_asal, pelabuhan_tujuan } = request.body
  var updated_at = new Date()

  pool.query(
    'UPDATE tbl_insaf_securite SET jenis_securite = $1 ,waktu_kejadian = $2 ,sumber_informasi_awal = $3 ,info_tambahan = $4 ,mmsi = $5 ,status_navigasi = $6 ,lokasi_terlapor = $7 ,degree1 = $8 ,minute1 = $9 ,second1 = $10 ,direction1 = $11 ,degree2 = $12 ,minute2 = $13 ,second2 = $14 ,direction2 = $15 ,descripsi_securite = $16 ,keterangan_pertolongan = $17 ,master_onboard = $18 ,nohp1 = $19 ,seccond_officer = $20 ,nohp2 = $21 , title = $23, pelabuhan_asal = $24, pelabuhan_tujuan = $25 WHERE id = $22',
    [jenis_securite ,waktu_kejadian ,sumber_informasi_awal ,info_tambahan ,mmsi ,status_navigasi ,lokasi_terlapor ,degree1 ,minute1 ,second1 ,direction1 ,degree2 ,minute2 ,second2 ,direction2 ,descripsi_securite ,keterangan_pertolongan ,master_onboard ,nohp1 ,second_officer , nohp2, id, title, pelabuhan_asal, pelabuhan_tujuan],(error, results) => {
      if (error) {
        throw error

      }else{

        pool.query('DELETE FROM tbl_insaf_securite_detail where securite_id=$1'
        , [id], (error, results) => {
            if (error) {

                if (error.code == '23505') {
                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                    response.status(400).send('Duplicate data')
                    return;
                }
            } else {
                
                pool.query('SELECT id FROM tbl_insaf_securite where id=$1 LIMIT 1', [id],  (error, results) => {
                    if (error) 
                    {
                        throw error
                    }
                    response.status(200).send({success:true,data: results.rows[0].id})
                })
                // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
            }

        })
      }

      // response.status(200).send({status:true,data:`User modified with ID: ${id}`})

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