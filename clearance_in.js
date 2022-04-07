const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;

const create = (request, response) => {
    const { voyage_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,speed_kapal,draught_saat_ini,informasi_lainnya,heading_kapal,approval_ksu,dokumen_spm } 
    = request.body

    let jenis_telkompel;

    var name = '';
   
      if (request.files){
      let sampleFile = request.files.dokumen_spm;
      console.log(sampleFile);
       const now = Date.now()
       name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
       console.log(__dirname);
       sampleFile.mv(path.join(__dirname + '/dokumens/clearance_in/') + name, function (err) {
           if (err)
               console.log(err);
       });
      }else{
        name=null;
        complete_path=null;
      }


    // if(dokumen_spm != '') {
    //   let sampleFile = request.files.dokumen_spm;
    //   console.log(sampleFile);
    //    const now = Date.now()
    //    name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
    //    console.log(__dirname);
    //    sampleFile.mv(path.join(__dirname + '/dokumens/clearance_in/') + name, function (err) {
    //        if (err)
    //            console.log(err);
    //    });
    // }

        pool.query('INSERT INTO tbl_insaf_clearance_in (voyage_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,speed_kapal,draught_saat_ini,informasi_lainnya,heading_kapal,approval_ksu,dokumen_spm) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9, $10, $11, $12, $13, $14, $15,$16,$17,$18, $19, $20, $21, $22, $23, $24,$25,$26, $27, $28, $29, $30, $31, $32, $33)'
        , [voyage_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,speed_kapal,parseFloat(draught_saat_ini),informasi_lainnya,heading_kapal,approval_ksu,name], (error, results) =>{
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
              response.status(200).send({success:true,data:'data clerance in berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_clearance_in where is_delete=false ORDER BY id DESC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_clearance_in where id=$1 and is_delete=false'
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

  pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where voyage_id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_clearance_in where voyage_id=$1 and is_delete=false'
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
    const { voyage_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,heading_kapal,speed_kapal,draught_saat_ini,informasi_lainnya } 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

    

     pool.query('SELECT * FROM tbl_insaf_clearance_in where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

        //  doc = results.rows[0].dokumen_spm;
        //  var doc_path = __dirname +path.join('/dokumens/clearance_in/'+ doc);
        //  console.log(doc_path);
        //  if (fs.existsSync(doc_path)){
        //   fs.unlinkSync(doc_path);
        //  }
         
        //  console.log(doc_path);

        //  let sampleFile = request.files.dokumen_spm;
        //  console.log(sampleFile);
        //   const now = Date.now()
        //   let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
        //   console.log(__dirname);
        //   sampleFile.mv(path.join(__dirname + '/dokumens/clearance_in/') + name, function (err) {
        //       if (err){
        //         console.log(err);
        //       }
                  
        //   });

        //   console.log(name);
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_clearance_in SET voyage_id=$1,degree1=$2,minute1=$3,second1=$4,direction1=$5,degree2=$6,minute2=$7,second2=$8,direction2=$9,weather_valid_from=$10,weather_valid_to=$11,weather_data_feed=$12,wind_speed_min=$13,wind_speed_max=$14,wind_from=$15,wind_to=$16,humidity_min=$17,humidity_max=$18,air_pressure=$19,temperature_min=$20,temperature_max=$21,low_tide=$22,high_tide=$23,low_tide_time=$24,high_tide_time=$25,weather=$26,informasi_cuaca_lainnya=$27,heading_kapal=$28,speed_kapal=$29,draught_saat_ini=$30,informasi_lainnya=$31,updated_at=$32 where id=$33'
         , [voyage_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,heading_kapal,speed_kapal,draught_saat_ini,informasi_lainnya,update_time,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data clearance in berhasil diperbarui'})
           }
     
         })




        });

    
}

const update_ksu = (request, response) => {
    const id = parseInt(request.params.id);
    const { voyage_id,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,heading_kapal,speed_kapal,draught_saat_ini,informasi_lainnya,approval_ksu,dokumen_spm } 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

    

     pool.query('SELECT * FROM tbl_insaf_clearance_in where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }
          
          var name;
          var complete_path;

          name = results.rows[0].dokumen_spm;
          complete_path = results.rows[0].url_dokumen_spm;
          if (request.files) {
              // doc = results.rows[0].dokumen_spm;
              // console.log(results.rows[0].dokumen_spm);
              // if(doc != ''){
              //   var doc_path = __dirname + path.join('/dokumens/clearance_in/' + doc);
              //   console.log(doc_path);
              //   fs.unlinkSync(doc_path);
              //   console.log(doc_path);
              // }

              var name = '';
              let sampleFile = request.files.dokumen_spm;
              console.log(sampleFile);
              const now = Date.now()
              name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
              complete_path = base_url + 'dokumens/clearance_in/' + name;
              console.log(__dirname);
              sampleFile.mv(path.join(__dirname + '/dokumens/clearance_in/') + name, function (err) {
                  if (err)
                      console.log(err);
              });
          }

            //  doc = results.rows[0].dokumen_spm;
            //  var doc_path = __dirname +path.join('/dokumens/clearance_in/'+ doc);
            //  console.log(doc_path);
            //  if (fs.existsSync(doc_path)){
            //   fs.unlinkSync(doc_path);
            //  }
            
            //  console.log(doc_path);
            //  var name='';
            //  if (request.files!==null>0){
            //  let sampleFile = request.files.dokumen_spm;
            //  console.log(sampleFile);
            //   const now = Date.now()
            //   name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
            //   var complete_path = base_url+'dokumens/clearance_in/'+name;
            //   console.log(__dirname);
            //   sampleFile.mv(path.join(__dirname + '/dokumens/clearance_in/') + name, function (err) {
            //       if (err){
            //         console.log(err);
            //       }
                      
            //   });
            // }else{
            //   name=null;
            //   complete_path=null;
            // }

            var approval = false;
            if(approval_ksu == 'ok'){
              approval = true;
            }

          console.log(name);
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_clearance_in SET approval_ksu=$1,dokumen_spm=$2,updated_at=$3,url_dokumen_spm=$4 where id=$5'
         , [approval,name,update_time,complete_path,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data clearance in berhasil diperbarui'})
           }
     
         })




        });

    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_clearance_in where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_clearance_in SET deleted_at=$1,is_delete=$2 where id=$3'
         , [deletetime, true,id], (error, results) =>{
           if (error) {
                 throw error
             if (error.code == '23505')
             {
                 //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                 response.status(400).send('Duplicate data')
                 return;
             }
           }else
           {
               response.status(200).send({success:true,data:'data clerance in berhasil dihapus'})
           }
     
         })




        });

        

   

   
    
}



const download = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/clearance_in/'+ filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
};


const read_new_notif = (request,response)=>{
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where is_delete=false and new_msg=true', (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_clearance_in where is_delete=false and new_msg=true ORDER BY id DESC'
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

  pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_in where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }else{
        //console.log(results.rows);
        pool.query('SELECT * FROM tbl_insaf_clearance_in where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }
          // 

          const update_time = new Date;
          pool.query('UPDATE tbl_insaf_clearance_in SET new_msg=$1,updated_at=$2 where id=$3'
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
                response.status(200).send({success:true,data:'data clearance in berhasil diperbarui'})
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
    update_ksu,
    delete_,
    download,
    read_new_notif,
    update_read_notif
    }