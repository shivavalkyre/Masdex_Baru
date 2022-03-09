const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;

const create = (request, response) => {
    const { voyage_id,nomor_spog,waktu_olah_gerak,alasan_olah_gerak,dokumen_spog,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2, created_by } 
    = request.body
    
    var name='';
    if (request.files){
    let sampleFile = request.files.dokumen_spog;
    console.log(sampleFile);
     const now = Date.now()
     name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
     var complete_path = base_url+'dokumens/spog/'+name;
     console.log(__dirname);
     sampleFile.mv(path.join(__dirname + '/dokumens/spog/') + name, function (err) {
         if (err)
             console.log(err);
     });
    }else{
      name=null;
      complete_path=null;
    }
    

     pool.query('INSERT INTO tbl_insaf_manouvre (voyage_id,nomor_spog,waktu_olah_gerak,alasan_olah_gerak,dokumen_spog,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,url_dokumen_spog,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)'
     ,[voyage_id,nomor_spog,waktu_olah_gerak,alasan_olah_gerak,name,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,complete_path,created_by],(error, results) =>{

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
             response.status(200).send({success:true,data:'data manouvre berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_manouvre where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT m.*,u.nama_lengkap FROM tbl_insaf_manouvre m join tbl_user_stakeholders u on u.id = m.created_by where m.is_delete=false ORDER BY m.id ASC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_manouvre where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_manouvre where id=$1 and is_delete=false'
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

  pool.query('SELECT count(*) as total FROM tbl_insaf_manouvre where voyage_id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_manouvre where voyage_id=$1 and is_delete=false'
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
    const { voyage_id,nomor_spog,waktu_olah_gerak,alasan_olah_gerak,dokumen_spog,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2 } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_manouvre where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })



     pool.query('SELECT * FROM tbl_insaf_manouvre where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         doc = results.rows[0].dokumen_spog;
         var doc_path = __dirname +path.join('/dokumens/spog/'+ doc);
         console.log(doc_path);
         if (fs.existsSync(doc_path)){
          fs.unlinkSync(doc_path);
         }
        
         console.log(doc_path);
         var name='';
         if (request.files!==null){
         let sampleFile = request.files.dokumen_spog;
         console.log(sampleFile);
          const now = Date.now()
          name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
          var complete_path = base_url+'dokumens/spog/'+name;
          console.log(__dirname);
          sampleFile.mv(path.join(__dirname + '/dokumens/spog/') + name, function (err) {
              if (err){
                console.log(err);
              }
                  
          });
        }else{
          name=null;
          complete_path=null;
        }

          console.log(name);
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_manouvre SET voyage_id=$1,nomor_spog=$2,waktu_olah_gerak=$3,alasan_olah_gerak=$4,dokumen_spog=$5,degree1=$6,minute1=$7,second1=$8,direction1=$9,degree2=$10,minute2=$11,second2=$12,direction2=$13,updated_at=$14,url_dokumen_spog=$15 where id=$16'
         , [voyage_id,nomor_spog,waktu_olah_gerak,alasan_olah_gerak,name,degree1,minute1,second1,direction1,degree2,minute2,second2,direction2,update_time,complete_path,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data manouvre berhasil diperbarui'})
           }
     
         })




        });

  
    
}

const update_operator = (request, response) => {
    const id = parseInt(request.params.id);
    const { weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,informasi_traffic,laporan_setelah_olah_gerak,status_radio_kapal,informasi_lainnya, is_manouvre } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_insaf_manouvre where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })



     pool.query('SELECT * FROM tbl_insaf_manouvre where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

        
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_manouvre SET weather_valid_from=$1,weather_valid_to=$2,weather_data_feed=$3,wind_speed_min=$4,wind_speed_max=$5,wind_from=$6,wind_to=$7,humidity_min=$8,humidity_max=$9,air_pressure=$10,temperature_min=$11,temperature_max=$12,low_tide=$13,high_tide=$14,low_tide_time=$15,high_tide_time=$16,weather=$17,informasi_cuaca_lainnya=$18,informasi_traffic=$19,laporan_setelah_olah_gerak=$20,status_radio_kapal=$21,informasi_lainnya=$22, is_manouvre=$23,updated_at=$24,is_complete=$25 where id=$26'
         , [ weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,air_pressure,temperature_min,temperature_max,low_tide,high_tide,low_tide_time,high_tide_time,weather,informasi_cuaca_lainnya,informasi_traffic,laporan_setelah_olah_gerak,status_radio_kapal,informasi_lainnya, is_manouvre,update_time,true,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data manouvre berhasil diperbarui'})
           }
     
         })




        });

  
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_manouvre where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_manouvre where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_manouvre SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data manouvre berhasil dihapus'})
           }
     
         })




        });

   
    
}


const download = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/spog/'+ filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
};


module.exports = {
    create,
    read,
    read_by_id,
    read_by_voyage_id,
    update,
    update_operator,
    delete_,
    download,
    }