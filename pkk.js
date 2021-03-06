const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
var complete_path='';

const create = (request, response) => {
    const { mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen } 
    = request.body

    let jenis_telkompel;

    let sampleFile = request.files.dokumen;
    console.log(sampleFile);
     const now = Date.now()
     let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
     complete_path = base_url+'dokumens/pkk/'+name;
     console.log(__dirname);
     sampleFile.mv(path.join(__dirname + '/dokumens/pkk/') + name, function (err) {
         if (err)
             console.log(err);
     });

    // pool.query('SELECT SELECT tbl_masdex_telkompel.jenis_telkompel FROM tbl_masdex_pelabuhan INNER JOIN tbl_masdex_telkompel ON tbl_masdex_pelabuhan.telkompel_id = tbl_masdex_telkompel."id" WHERE tbl_masdex_pelabuhan."id" = $1',[pelabuhan_tujuan], (error,results)=> {
    //   if (error) {
    //     response.status(201).send(error)
    //   }
    //     console.log(results);
    //     jenis_telkompel = results.rows[0].jenis_telkompel;

    // });

    pool.query('SELECT tbl_masdex_telkompel.jenis_telkompel FROM tbl_masdex_pelabuhan INNER JOIN tbl_masdex_telkompel ON tbl_masdex_pelabuhan.telkompel_id = tbl_masdex_telkompel."id" WHERE tbl_masdex_pelabuhan."id" = $1',[pelabuhan_tujuan] ,(error, results) => {
      if (error) {
        throw error
      }
        jenis_telkompel = results.rows[0].jenis_telkompel;
        //console.log(jenis_telkompel);


        pool.query('INSERT INTO tbl_masdex_pkk (mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen_pkk,jenis_telkompel) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9, $10, $11, $12, $13, $14, $15,$16,$17)'
        , [mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,complete_path,jenis_telkompel], (error, results) =>{
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
              response.status(200).send({success:true,data:'data pkk berhasil dibuat'})
          }
    
        })
     })
  
   

   
}

const read = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_pkk where is_delete=false ORDER BY id ASC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_masdex_pkk where id=$1 and is_delete=false'
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
    const { mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen } 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

    pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })


    pool.query('SELECT SELECT tbl_masdex_telkompel.jenis_telkompel FROM tbl_masdex_pelabuhan INNER JOIN tbl_masdex_telkompel ON tbl_masdex_pelabuhan.telkompel_id = tbl_masdex_telkompel."id" WHERE tbl_masdex_pelabuhan."id" = $1',[pelabuhan_tujuan], (error,results)=> {
      if (error) {
        response.status(201).send(error)
      }

        jenis_telkompel = results.rows[0].jenis_telkompel;

    });

     pool.query('SELECT * FROM tbl_masdex_pkk where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         doc = results.rows[0].dokumen_pkk;
         var doc_path = __dirname +path.join('/dokumens/pkk/'+ doc);
         console.log(doc_path);
         fs.unlinkSync(doc_path);
         console.log(doc_path);

         let sampleFile = request.files.dokumen;
         console.log(sampleFile);
          const now = Date.now()
          let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
          console.log(__dirname);
          sampleFile.mv(path.join(__dirname + '/dokumens/pkk/') + name, function (err) {
              if (err){
                console.log(err);
              }
                  
          });

          console.log(name);
         const update_time = new Date;
         pool.query('UPDATE tbl_masdex_pkk SET mmsi=$1, agen_kapal=$2, pelabuhan_asal=$3, pelabuhan_tujuan=$4, pelabuhan_selanjutnya=$5, dermaga_tujuan=$6, area_tambat_tujuan=$7,zona_labuh_tujuan=$8,jenis_muatan=$9,maksimal_draft=$10,eta=$11,etd=$12,jenis_pelayaran=$13,nama_nahkoda=$14,telepon_nahkoda=$15,dokumen_pkk=$16,updated_at=$17 where id=$18'
         , [mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,name,update_time,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data pkk berhasil diperbarui'})
           }
     
         })




        });

        

   

   
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where id=$1 and is_delete=false', [id], (error, results) => {
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
         pool.query('UPDATE tbl_masdex_pkk SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data pkk berhasil dihapus'})
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