const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;

const create = (request, response) => {
    const { voyage_id,trouble,last_port,pelabuhan_tujuan,jenis_pelayaran,more_information,estimated_time_arrival, created_by } 
    = request.body

     pool.query('INSERT INTO tbl_insaf_passing (voyage_id,trouble,last_port,pelabuhan_tujuan,jenis_pelayaran,more_information,estimated_time_arrival,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8)'
     ,[voyage_id,trouble,last_port,pelabuhan_tujuan,jenis_pelayaran,more_information,estimated_time_arrival,created_by],(error, results) =>{

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
             response.status(200).send({success:true,data:'data passing berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_passing where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT m.*,u.nama_lengkap FROM tbl_insaf_passing m join tbl_user_stakeholders u on u.id = m.created_by where m.is_delete=false ORDER BY m.id DESC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_passing where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_passing where id=$1 and is_delete=false'
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

const read_by_voyage = (request, response) => {

  const id = parseInt(request.params.id);
  //console.log('Here');
  //console.log(id);
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_insaf_passing where voyage_id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT p.*,lp.nama_pelabuhan as nama_last_port,tp.nama_pelabuhan as nama_pelabuhan_tujuan FROM tbl_insaf_passing p left join tbl_masdex_pelabuhan lp on lp.id = p.last_port left join tbl_masdex_pelabuhan tp on tp.id = p.pelabuhan_tujuan where p.voyage_id=$1 and p.is_delete=false'
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
    const { voyage_id,trouble,last_port,pelabuhan_tujuan,jenis_pelayaran,more_information,estimated_time_arrival } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_passing where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })



     pool.query('SELECT * FROM tbl_insaf_passing where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_passing SET voyage_id=$1,trouble=$2,last_port=$3,pelabuhan_tujuan=$4,jenis_pelayaran=$5,more_information=$6,estimated_time_arrival=$8 where id=$7'
         , [voyage_id,trouble,last_port,pelabuhan_tujuan,jenis_pelayaran,more_information,id,estimated_time_arrival], (error, results) =>{
           if (error) {
              throw error
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
               response.status(200).send({success:true,data:'data passing berhasil diperbarui'})
           }
     
         })




        });

  
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_passing where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_passing where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_passing SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data passing berhasil dihapus'})
           }
     
         })




        });

   
    
}


const read_new_notif = (request,response)=>{
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_insaf_passing where is_delete=false and new_msg=true', (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_passing where is_delete=false and new_msg=true ORDER BY id DESC'
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

const update_read_notif = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT count(*) as total FROM tbl_insaf_passing where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }else{
        //console.log(results.rows);
        pool.query('SELECT * FROM tbl_insaf_passing where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }
          // 

          const update_time = new Date;
          pool.query('UPDATE tbl_insaf_passing SET new_msg=$1,updated_at=$2 where id=$3'
          , [false,update_time,id], (error, results) =>{
            if (error) {
               throw error
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
                response.status(200).send({success:true,data:'data passing berhasil diperbarui'})
            }
      
          })


        })
    }
    
})


}


module.exports = {
    create,
    read,
    read_by_id,
    read_by_voyage,
    update,
    delete_,
    read_new_notif,
    update_read_notif
    }