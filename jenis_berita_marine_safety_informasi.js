const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { jenis_berita_marine_safety_informasi, created_by } 
    = request.body

   
     const create_time = new Date;
     pool.query('INSERT INTO tbl_insaf_jenis_berita_marine_safety_informasi (jenis_berita_marine_safety_informasi, created_by, created_at) VALUES($1, $2, $3)'
     ,[jenis_berita_marine_safety_informasi, created_by, create_time],(error, results) =>{

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
             response.status(200).send({success:true,data:'data jenis berita marine safety informasi berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_jenis_berita_marine_safety_informasi where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_jenis_berita_marine_safety_informasi where is_delete=false ORDER BY id DESC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_jenis_berita_marine_safety_informasi where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_jenis_berita_marine_safety_informasi where id=$1 and is_delete=false'
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
    const { jenis_berita_marine_safety_informasi, updated_by } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_jenis_berita_marine_safety_informasi where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })



     pool.query('SELECT * FROM tbl_insaf_jenis_berita_marine_safety_informasi where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_jenis_berita_marine_safety_informasi SET jenis_berita_marine_safety_informasi=$1,updated_at=$2,updated_by=$4 where id=$3'
         , [jenis_berita_marine_safety_informasi,update_time,id,updated_by], (error, results) =>{
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
               response.status(200).send({success:true,data:'data jenis berita marine safety informasi berhasil diperbarui'})
           }
     
         })




        });

  
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 
    const deleted_by = 0;

    pool.query('SELECT count(*) as total FROM tbl_insaf_jenis_berita_marine_safety_informasi where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_jenis_berita_marine_safety_informasi where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_jenis_berita_marine_safety_informasi SET deleted_at=$1,is_delete=$2, deleted_by=$4 where id=$3'
         , [deletetime, true, id, deleted_by], (error, results) =>{
           if (error) {

             if (error.code == '23505')
             {
                 //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                 response.status(400).send('Duplicate data')
                 return;
             }
           }else
           {
               response.status(200).send({success:true,data:'data jenis berita marine safety informasi berhasil dihapus'})
           }
     
         })




        });

   
    
}

module.exports = {
    create,
    read,
    read_by_id,
    update,
    delete_,
    }