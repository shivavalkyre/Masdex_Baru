const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;


const create = (request, response) => {
    const { voyage_id,general_information,area_tambat,status_entering_id } 
    = request.body

   

    // let sampleFile1 = request.files.dokumen_berthing;
    // console.log(sampleFile);
    //  const now = Date.now()
    //  let name1 = now + '_' + sampleFile1['name'].replace(/\s+/g, '')
    //  console.log(__dirname);
    //  sampleFile1.mv(path.join(__dirname + '/dokumens/entering_to_port/dokumen_berthing') + name1, function (err) {
    //      if (err)
    //          console.log(err);
    //  });

    //  let sampleFile2 = request.files.dokumen_ppk;
    //  console.log(sampleFile);
    //   const now = Date.now()
    //   let name2 = now + '_' + sampleFile2['name'].replace(/\s+/g, '')
    //   console.log(__dirname);
    //   sampleFile2.mv(path.join(__dirname + '/dokumens/entering_to_port/dokumen_ppk') + name2, function (err) {
    //       if (err)
    //           console.log(err);
    //   });
 


        pool.query('INSERT INTO tbl_insaf_entering_to_port (voyage_id,general_information,area_tambat,status_entering_id) VALUES ($1, $2, $3, $4)'
        , [voyage_id,general_information,area_tambat,status_entering_id], (error, results) =>{
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
              response.status(200).send({success:true,data:'data entering to port berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_entering_to_port where is_delete=false ORDER BY id DESC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false'
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


const read_by_voyage_id = (request, response) => {

  const id = parseInt(request.params.id);
  //console.log('Here');
  //console.log(id);
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where voyage_id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_entering_to_port where voyage_id=$1 and is_delete=false'
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
    const { voyage_id,general_information,area_tambat,status_entering_id } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })


     pool.query('SELECT * FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

        
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_entering_to_port SET voyage_id=$1,general_information=$2,area_tambat=$3,status_entering_id=$4,updated_at=$5 where id=$6'
         , [voyage_id,general_information,area_tambat,status_entering_id,update_time,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data entering to port berhasil diperbarui'})
           }
     
         })




        });

  
    
}

const update_by_otoritas = (request, response) => {
    const id = parseInt(request.params.id);
    const { dokumen_berthing,dokumen_ppk } 
    = request.body;
    let doc1;
    let doc2;

    pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })


     pool.query('SELECT * FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }
          
          var name1;
          var complete_path1;
          name1 = results.rows[0].dokumen_berthing;
          complete_path1 = results.rows[0].url_dokumen_berthing;
          if (request.files) {
              // doc1 = results.rows[0].dokumen_berthing;
              // console.log(results.rows[0].dokumen_berthing);
              // if(doc1 != '' || doc1 != null){
              //   if(complete_path1 != '' || complete_path1 != null){
              //     var doc1_path = __dirname + path.join('/dokumens/entering_to_port/dokumen_berthing/' + doc1);
              //     console.log(doc1_path);
              //     fs.unlinkSync(doc1_path);
              //     console.log(doc1_path);
              //   }
              // }

              var name1 = '';
              let sampleFile = request.files.dokumen_berthing;
              console.log(sampleFile);
              const now = Date.now()
              name1 = now + '_' + sampleFile['name'].replace(/\s+/g, '')
              complete_path1 = base_url + 'dokumens/entering_to_port/dokumen_berthing/' + name1;
              console.log(__dirname);
              sampleFile.mv(path.join(__dirname + '/dokumens/entering_to_port/dokumen_berthing/') + name1, function (err) {
                  if (err)
                      console.log(err);
              });
          }

          var name2;
          var complete_path2;
          name2 = results.rows[0].dokumen_ppk;
          complete_path2 = results.rows[0].url_dokumen_ppk;
          if (request.files) {
              // doc2 = results.rows[0].dokumen_ppk;
              // console.log(results.rows[0].dokumen_ppk);
              // if(doc2 != '' || doc2 != null){
              //   if(complete_path2 != '' || complete_path2 != null){
              //     var doc2_path = __dirname + path.join('/dokumens/entering_to_port/dokumen_ppk/' + doc2);
              //     console.log(doc2_path);
              //     fs.unlinkSync(doc2_path);
              //     console.log(doc2_path);
              //   }
              // }

              var name2 = '';
              let sampleFile = request.files.dokumen_ppk;
              console.log(sampleFile);
              const now = Date.now()
              name2 = now + '_' + sampleFile['name'].replace(/\s+/g, '')
              complete_path2 = base_url + 'dokumens/entering_to_port/dokumen_ppk/' + name2;
              console.log(__dirname);
              sampleFile.mv(path.join(__dirname + '/dokumens/entering_to_port/dokumen_ppk/') + name2, function (err) {
                  if (err)
                      console.log(err);
              });
          }
  
          //  doc1 = results.rows[0].dokumen_berthing;
          //  if (doc1!= null)
          //  {
          //       var doc_path1 = __dirname +path.join('/dokumens/entering_to_port/dokumen_berthing/'+ doc1);
          //       console.log(doc_path1);
          //       fs.unlinkSync(doc_path1);
          //  }

          //  doc2 = results.rows[0].dokumen_ppk;

          //  if (doc2!= null)
          //   {
          //       var doc_path2 = __dirname +path.join('/dokumens/entering_to_port/dokumen_ppk/'+ doc2);
          //       console.log(doc_path2);
          //       fs.unlinkSync(doc_path2);
          //   }
          //   var name1='';
          // if (request.files!==null){
          // let sampleFile1 = request.files.dokumen_berthing;
          // console.log(sampleFile1);
          //  const now1 = Date.now()
          //  name1 = now1 + '_' + sampleFile1['name'].replace(/\s+/g, '')
          //  console.log(__dirname);
          //  sampleFile1.mv(path.join(__dirname + '/dokumens/entering_to_port/dokumen_berthing/') + name1, function (err) {
          //      if (err){
          //        console.log(err);
          //      }
                   
          //  });
          // }else{
          //   name1=null;
          // }

          // var name2='';
          // if (request.files!==null){
          //  let sampleFile2 = request.files.dokumen_ppk;
          //  console.log(sampleFile2);
          //   const now2 = Date.now()
          //   name2 = now2 + '_' + sampleFile2['name'].replace(/\s+/g, '')
          //   console.log(__dirname);
          //   sampleFile2.mv(path.join(__dirname + '/dokumens/entering_to_port/dokumen_ppk/') + name2, function (err) {
          //       if (err){
          //         console.log(err);
          //       }
                    
          //   });
          // }else{
          //   name2=null;
          // }


         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_entering_to_port SET dokumen_berthing=$1,dokumen_ppk=$2,updated_at=$3,is_complete=$5,is_entering_to_port=$5,url_dokumen_berthing=$6,url_dokumen_ppk=$7 where id=$4'
         , [name1,name2,update_time,id, true, complete_path1, complete_path2], (error, results) =>{
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
               response.status(200).send({success:true,data:'data entering to port berhasil diperbarui'})
           }
     
         })

        });

  
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_entering_to_port SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data entering to port berhasil dihapus'})
           }
     
         })




        });

   
    
}


const download_pkk = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/entering_to_port/dokumen_ppk/'+ filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
};

const download_berthing = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/entering_to_port/dokumen_berthing/'+ filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
};


const read_new_notif = (request,response)=>{
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where is_delete=false and new_msg=true', (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_entering_to_port where is_delete=false and new_msg=true ORDER BY id DESC'
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

  pool.query('SELECT count(*) as total FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }else{
        //console.log(results.rows);
        pool.query('SELECT * FROM tbl_insaf_entering_to_port where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }
          // 

          const update_time = new Date;
          pool.query('UPDATE tbl_insaf_entering_to_port SET new_msg=$1,updated_at=$2 where id=$3'
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
                response.status(200).send({success:true,data:'data entering to port berhasil diperbarui'})
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
    read_by_voyage_id,
    update,
    update_by_otoritas,
    delete_,
    download_pkk,
    download_berthing,
    read_new_notif,
    update_read_notif
    }