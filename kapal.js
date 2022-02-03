const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
    const { perusahaan_pelayaran_id,ship_name,gt,mmsi,imo,callsign,flag,max_draft,length,width,loa,ship_type,foto_kapal } 
    = request.body

    var name='';
    if (request.files.size>0){
    let sampleFile = request.files.foto_kapal;
    console.log(sampleFile);
     const now = Date.now()
     name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
     console.log(__dirname);
     sampleFile.mv(path.join(__dirname + '/dokumens/kapal/foto/') + name, function (err) {
         if (err)
             console.log(err);
     });
    }else{
      name= null;
    }
     pool.query('INSERT INTO tbl_masdex_kapal (perusahaan_pelayaran_id,ship_name,gt,mmsi,imo,call_sign,flag,max_draft,length,width,loa,ship_type,foto_kapal) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)'
     ,[perusahaan_pelayaran_id,ship_name,gt,mmsi,imo,callsign,flag,parseFloat(max_draft),length,width,loa,parseInt(ship_type),name],(error, results) =>{

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
             response.status(200).send({success:true,data:'data kapal berhasil dibuat'})
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

  
    pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_kapal where is_delete=false ORDER BY id ASC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_kapal where id=$1 and is_delete=false'
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

const read_by_mmsi = (request, response) => {

    const mmsi = parseInt(request.params.mmsi);
    //console.log('Here');
    //console.log(id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where mmsi=$1 and is_delete=false', [mmsi], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_kapal where mmsi=$1 and is_delete=false'
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

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { perusahaan_pelayaran_id,ship_name,gt,mmsi,imo,callsign,flag,max_draft,length,width,loa,ship_type,foto_kapal } 
    = request.body;
    let doc;

    pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })



     pool.query('SELECT * FROM tbl_masdex_kapal where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         doc = results.rows[0].foto_kapal;
         var doc_path = __dirname +path.join('/dokumens/kapal/foto/'+ doc);
         console.log(doc_path);
         fs.unlinkSync(doc_path);
         console.log(doc_path);
         var name='';
         if (request.files.size>0){

         let sampleFile = request.files.foto_kapal;
         console.log(sampleFile);
          const now = Date.now()
          name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
          console.log(__dirname);
          sampleFile.mv(path.join(__dirname + '/dokumens/kapal/foto/') + name, function (err) {
              if (err){
                console.log(err);
              }
                  
          });

        }else{
          name=null;
        }

          console.log(name);
         const update_time = new Date;
         pool.query('UPDATE tbl_masdex_kapal SET perusahaan_pelayaran_id=$1,ship_name=$2,gt=$3,mmsi=$4,imo=$5,call_sign=$6,flag=$7,max_draft=$8,length=$9,width=$10,loa=$11,ship_type=$12,foto_kapal=$13,updated_at=$14 where id=$15'
         , [perusahaan_pelayaran_id,ship_name,gt,mmsi,imo,callsign,flag,parseFloat(max_draft),parseFloat(length),parseFloat(width),loa,parseInt(ship_type),name,update_time,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data kapal berhasil diperbarui'})
           }
     
         })




        });

  
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_masdex_kapal where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_masdex_pkk where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_masdex_kapal SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data kapal berhasil dihapus'})
           }
     
         })




        });

   
    
}

module.exports = {
    create,
    read,
    read_by_id,
    read_by_mmsi,
    update,
    delete_,
    }