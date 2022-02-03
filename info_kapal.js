const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')


const read_kapal_persh_pelayaran = (request, response) => {

    //const mmsi= parseInt(request.params.mmsi);
    const { perusahaan } 
    = request.body

    console.log(perusahaan);
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM info_kapal_persh_pelayaran where nama_lengkap=$1', [perusahaan], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM  info_kapal_persh_pelayaran where nama_lengkap=$1'
     pool.query(sql,[perusahaan] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const read_kapal_persh_pelayaran_by_mmsi = (request, response) => {

    const mmsi= request.params.mmsi;
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM info_kapal_persh_pelayaran Where mmsi=$1', [mmsi], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM  info_kapal_persh_pelayaran where mmsi=$1'
     pool.query(sql,[mmsi] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}


const read_kapal_agen = (request, response) => {

    //const mmsi= parseInt(request.params.mmsi);
    const { agen } 
    = request.body
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM info_kapal_persh_agen where nama_lengkap=$1', [agen], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM  info_kapal_persh_agen where nama_lengkap=$1'
     pool.query(sql,[agen] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const read_kapal_agen_kapal_by_mmsi = (request, response) => {

    const mmsi= request.params.mmsi;
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM info_kapal_persh_agen WHERE mmsi=$1', [mmsi], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM  info_kapal_persh_agen where mmsi=$1'
     pool.query(sql,[mmsi] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

module.exports = {
    read_kapal_persh_pelayaran,
    read_kapal_persh_pelayaran_by_mmsi,
    read_kapal_agen,
    read_kapal_agen_kapal_by_mmsi,
}