const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { pkk_id, mmsi,module } 
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

    //000001/MM/YY/MAS/DNVTGPRIOK
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //console.log(fullUrl);
    var total=0;

    if (module==='masdex'){

      var sql= "SELECT count(*) as total FROM tbl_insaf_voyage where is_delete=false and journal_no like '%MAS%' and date_part('year', created_at) = date_part('year', CURRENT_DATE)";
      pool.query(sql ,(error, results) => {
         total  = results.rows[0].total;
         console.log('totalnya:'+total);

        // console.log(total);

        if (Number(total)>0){

          console.log('here');

          var sql= "SELECT journal_no FROM tbl_insaf_voyage where is_delete=false and journal_no like '%MAS%' and date_part('year', created_at) = date_part('year', CURRENT_DATE) GROUP BY id ORDER BY id DESC LIMIT 1";
          pool.query(sql ,(error, results) => {
            if (error) {
              throw error
            }
                var no = results.rows[0].journal_no;
                console.log('journal no: '+ no);
                var no_step1 = no.substring(0,6);
                var no_step2 = Number(no_step1);
                var no_step3 = no_step2+1;
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                var yy = yyyy.toString().substring(2,4);
                var back_no = '/'+mm+'/'+yy+'/MAS/DNVTGPRIOK'; 
      
                //var no_journal = padStart(0,no_step2+1)+'/MM/YY/MAS/DNVTGPRIOK';
                var no_journal = no_step3.toString().padStart(6,0)+back_no;
                console.log(no_journal);

                var sql= 'INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES($1,$2,$3) RETURNING id';  
                pool.query(sql, [pkk_id,mmsi,no_journal], (error, results) => { 
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
                      response.status(200).send({success:true,data: results.rows[0],no_journal: no_journal, msg: 'data voyage berhasil dibuat'})
                  }
            
                });

          });
        }else{
            var no = '000000/MM/YY/MAS/DNVTGPRIOK';
            var no_step1 = no.substring(0,6);
            var no_step2 = Number(no_step1);
            var no_step3 = no_step2+1;
            console.log(no_step3);

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var yy = yyyy.toString().substring(2,4);
            var back_no = '/'+mm+'/'+yy+'/MAS/DNVTGPRIOK'; 

            //var no_journal = padStart(0,no_step2+1)+'/MM/YY/MAS/DNVTGPRIOK';
            var no_journal = no_step3.toString().padStart(6,0)+back_no;
            console.log(no_journal);

            var sql= 'INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES($1,$2,$3) RETURNING id';  
            pool.query(sql, [pkk_id,mmsi,no_journal], (error, results) => { 
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
                  response.status(200).send({success:true,data: results.rows[0],no_journal: no_journal, msg: 'data voyage berhasil dibuat'})
              }
        
            });
        }
        
        //pool.query(`INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES (${pkk_id}, ${mmsi}); SELECT currval(pg_get_serial_sequence('tbl_insaf_voyage','id'));`, (error, results) =>{

      });
     
    }else if(module==='insaf'){

      var sql= "SELECT count(*) as total FROM tbl_insaf_voyage where is_delete=false and journal_no like '%INF%' and date_part('year', created_at) = date_part('year', CURRENT_DATE)";
      pool.query(sql ,(error, results) => {
         total  = results.rows[0].total;
     

      if (total>0){

        var sql= "SELECT * FROM tbl_insaf_voyage where is_delete=false and journal_no like '%INF%' and date_part('year', created_at) = date_part('year', CURRENT_DATE) GROUP BY id ORDER BY id DESC LIMIT 1";
        pool.query(sql ,(error, results) => {
          if (error) {
            throw error
          }
            var no = results.rows[0].journal_no;
            var no_step1 = no.substring(0,6);
            var no_step2 = Number(no_step1);
            var no_step3 = no_step2+1;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var yy = yyyy.toString().substring(2,4);
            //today = mm + '/' + dd + '/' + yyyy;
  
            // var no_journal = padStart(0,no_step2+1)+'/MM/YY/INF/DNVTGPRIOK';
            var back_no = '/'+mm+'/'+yy+'/INF/DNVTGPRIOK'; 
            //var no_journal = padStart(0,no_step2+1)+'/MM/YY/MAS/DNVTGPRIOK';
            var no_journal = no_step3.toString().padStart(6,0)+back_no;
            console.log(no_journal);
  
            //RETURNING id

                //pool.query(`INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES (${pkk_id}, ${mmsi}); SELECT currval(pg_get_serial_sequence('tbl_insaf_voyage','id'));`, (error, results) =>{
            var sql= 'INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES($1,$2,$3) RETURNING id';  
            pool.query(sql, [pkk_id,mmsi,no_journal], (error, results) => { 
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
                  response.status(200).send({success:true,data: results.rows[0],no_journal: no_journal, msg: 'data voyage berhasil dibuat'})
              }
        
            });
              
        });
      }else{

        var no = '000000/MM/YY/INF/DNVTGPRIOK';
        var no_step1 = no.substring(0,6);
        var no_step2 = Number(no_step1);
        var no_step3 = no_step2+1;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var yy = yyyy.toString().substring(2,4);
        var back_no = '/'+mm+'/'+yy+'/INF/DNVTGPRIOK'; 

        //var no_journal = padStart(0,no_step2+1)+'/MM/YY/MAS/DNVTGPRIOK';
        var no_journal = no_step3.toString().padStart(6,0)+back_no;
        console.log(no_journal);

            //pool.query(`INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES (${pkk_id}, ${mmsi}); SELECT currval(pg_get_serial_sequence('tbl_insaf_voyage','id'));`, (error, results) =>{
            var sql= 'INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES($1,$2,$3) RETURNING id';  
            pool.query(sql, [pkk_id,mmsi,no_journal], (error, results) => { 
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
                  response.status(200).send({success:true,data: results.rows[0],no_journal: no_journal, msg: 'data voyage berhasil dibuat'})
              }
        
            });

      }
      
         


    });

    } else{
      response.status(400).send({sucess:false,data:'format tidak sesuai'});
    }

}

const read = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    //var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
    //console.log(fullUrl);


    pool.query('SELECT count(*) as total FROM tbl_insaf_voyage where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_voyage where is_delete=false ORDER BY id DESC'
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