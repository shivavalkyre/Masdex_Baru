const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')


const create = (request, response) => {
    const { kode,nama_pelabuhan,alamat_pelabuhan,jenis_pelabuhan,telkompel_id } 
    = request.body

    

     pool.query('INSERT INTO tbl_masdex_pelabuhan (kode,nama_pelabuhan,alamat_pelabuhan,jenis_pelabuhan,telkompel_id) VALUES($1,$2,$3,$4,$5)'
     ,[kode,nama_pelabuhan,alamat_pelabuhan,jenis_pelabuhan,telkompel_id],(error, results) =>{

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
             response.status(200).send({success:true,data:'data pelabuhan berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_masdex_pelabuhan where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_pelabuhan where is_delete=false ORDER BY id ASC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_masdex_pelabuhan where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_pelabuhan where id=$1 and is_delete=false'
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
    const { kode,nama_pelabuhan,alamat_pelabuhan,jenis_pelabuhan,telkompel_id } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_masdex_perubahan where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })



     pool.query('SELECT * FROM tbl_masdex_pelabuhan where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

        
         const update_time = new Date;
         pool.query('UPDATE tbl_masdex_pelabuhan SET kode=$1,nama_pelabuhan=$2,alamat_pelabuhan=$3,jenis_pelabuhan=$4,telkompel_id=$5 where id=$6'
         , [kode,nama_pelabuhan,alamat_pelabuhan,jenis_pelabuhan,telkompel_id,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data pelabuhan berhasil diperbarui'})
           }
     
         })

        });

}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_masdex_pelabuhan where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_masdex_pelabuhan where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_masdex_pelabuhan SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data pelabuhan berhasil dihapus'})
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