const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { pkk_id, mmsi } 
    = request.body

    // let jenis_telkompel;

    // let sampleFile = request.files.dokumen;
    // console.log(sampleFile);
    //  const now = Date.now()
    //  let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
    //  console.log(__dirname);
    //  sampleFile.mv(path.join(__dirname + '/dokumens/pkk/') + name, function (err) {
    //      if (err)
    //          console.log(err);
    //  });

    // pool.query('SELECT SELECT tbl_masdex_telkompel.jenis_telkompel FROM tbl_masdex_pelabuhan INNER JOIN tbl_masdex_telkompel ON tbl_masdex_pelabuhan.telkompel_id = tbl_masdex_telkompel."id" WHERE tbl_masdex_pelabuhan."id" = $1',[pelabuhan_tujuan], (error,results)=> {
    //   if (error) {
    //     response.status(201).send(error)
    //   }

    //     jenis_telkompel = results.rows[0].jenis_telkompel;

    // });

    pool.query(`INSERT INTO tbl_insaf_voyage (pkk_id, mmsi) VALUES (${pkk_id}, ${mmsi}); SELECT currval(pg_get_serial_sequence('tbl_insaf_voyage','id'));`, (error, results) =>{
      if (error) {
         throw error
        response.status(201).send(error)
        if (error.code == '23505')
        {
            //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
            response.status(400).send('Duplicate data')
            return;
        }
      }else
      {
          response.status(200).send({success:true,data: results[1].rows[0].currval, msg: 'data voyage berhasil dibuat'})
      }

    })
}

const read = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_voyage where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_voyage where is_delete=false ORDER BY id ASC'
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const read_by_id = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_voyage where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_voyage where id=$1 and is_delete=false'
     pool.query(sql,[id] ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { pkk_id} 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

    pool.query('SELECT count(*) as total FROM tbl_insaf_voyage where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);

            
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_voyage SET pkk_id=$1,updated_at=$2 where id=$3'
         , [pkk_id,update_time,id], (error, results) =>{
           if (error) {
             // throw error
             //response.status(201).send(error)
             //console.log(error);
             if (error.code == '23505')
             {
                 //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                 response.status(400).send('Duplicate data')
                 return;
             }
           }else
           {
               response.status(200).send({success:true,data:'data voyage berhasil diperbarui'})
           }
     
         })
        }
        
    })

    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_voyage where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_voyage where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_voyage SET deleted_at=$1,is_delete=$2 where id=$3'
         , [deletetime, true,id], (error, results) =>{
           if (error) {

             if (error.code == '23505')
             {
                 //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                 response.status(400).send('Duplicate data')
                 return;
             }
           }else
           {
               response.status(200).send({success:true,data:'data voyage berhasil dihapus'})
           }
     
         })




        });

  
}


const voyage_status = (request, response) => {

  const {page,rows,sortBy,sortDirection} = request.query
  var page_req = page || 1
  var rows_req = rows || 10
  var sort_by_req = sortBy || null
  var sort_direction_req = sortDirection || null
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM ship_status_last_status_v2', (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM ship_status_last_status_v2'
   if (sort_by_req && sort_direction_req) sql += ` ORDER BY ${sort_by_req} ${sort_direction_req}`
   pool.query(sql ,(error, results) => {
     if (error) {
       throw error
     }
     items.push({rows:results.rows})
     res.push(items)
     response.status(200).send({success:true,data:res})
   })

  })

}

const voyage_status_by_id = (request, response) => {

  const id = parseInt(request.params.id);
  const res = []
  const items = []

  pool.query('SELECT * FROM ship_status_last_status_v2 WHERE voyage_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    items.push({ rows:results.rows })
    res.push(items)
    response.status(200).send({ success: true, data: res })
  })
}


module.exports = {
  create,
  read,
  read_by_id,
  update,
  delete_,
  voyage_status,
  voyage_status_by_id,
}