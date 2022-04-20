const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const http = require('http')
var complete_path='';

const create = (request, response) => {
    const { mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen,no_dokumen,user_agen,company_agen } 
    = request.body

    let jenis_telkompel;
    var name='';
    if (request.files!==null){
    let sampleFile = request.files.dokumen;
    console.log(sampleFile);
     const now = Date.now()
     name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
     complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/pkk/'+name;
     console.log(__dirname);
     sampleFile.mv(path.join(__dirname + '/dokumens/pkk/') + name, function (err) {
         if (err)
             console.log(err);
     });
    }else{
      name= null;
      complete_path=null;
    }

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


        pool.query('INSERT INTO tbl_masdex_pkk (mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen_pkk,jenis_telkompel,url_pkk,no_dokumen,user_agen,company_agen) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9, $10, $11, $12, $13, $14, $15,$16,$17,$18,$19,$20,$21) RETURNING *'
        , [mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,name,jenis_telkompel,complete_path,no_dokumen,user_agen,company_agen], (error, results) =>{
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
              // create voyage
              //  var data = "pkk_id="
              // const options = {
              //   hostname: 'localhost:3012/api/V1/insaf/voyage',
              //   port: 3012,
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/x-www-form-urlencoded',
              //     'Content-Length': data.length
              //   }
              // }
              
              // const req = https.request(options, res => {
              //   console.log(`statusCode: ${res.statusCode}`)
              
              //   res.on('data', d => {
              //     process.stdout.write(d)
              //   })
              // })
              
              // req.on('error', error => {
              //   console.error(error)
              // })
              
              // req.write(data)
              // req.end()
              var pkk_id = results.rows[0].id;
              var module = 'masdex';
              console.log(pkk_id);
              /*
                pool.query('INSERT INTO tbl_insaf_voyage (pkk_id) VALUES ($1)'
                , [pkk_id], (error, results) =>{
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
                      //response.status(200).send({success:true,data:'data voyage berhasil dibuat'})
                  }
            
                })
              */
             
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
                      }
                
                    });
                }
                
                //pool.query(`INSERT INTO tbl_insaf_voyage (pkk_id, mmsi,journal_no) VALUES (${pkk_id}, ${mmsi}); SELECT currval(pg_get_serial_sequence('tbl_insaf_voyage','id'));`, (error, results) =>{

              });

              response.status(200).send({success:true,data:'data pkk berhasil dibuat'})
          }
    
        })
     })
  
   

   
}


const createFromInsaf = (request, response) => {
  const { id_voyage, mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen,no_dokumen,user_agen,company_agen } 
  = request.body

  let jenis_telkompel;
  var name='';
  console.log(request.files);
  if (request.files!==null){
    let sampleFile = request.files.dokumen;
    console.log(sampleFile);
    const now = Date.now()
    name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
    complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/pkk/'+name;
    console.log(__dirname);
    sampleFile.mv(path.join(__dirname + '/dokumens/pkk/') + name, function (err) {
        if (err)
            console.log(err);
    });
  }else{
    name= null;
    complete_path=null;
  }

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
      if(results.rows[0]){
        jenis_telkompel = results.rows[0].jenis_telkompel;
      }else{
        jenis_telkompel = "SROP";
      }
      //console.log(jenis_telkompel);


      pool.query('INSERT INTO tbl_masdex_pkk (mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen_pkk,jenis_telkompel,url_pkk,no_dokumen,user_agen,company_agen) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9, $10, $11, $12, $13, $14, $15,$16,$17,$18,$19,$20,$21) RETURNING *'
      , [mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,name,jenis_telkompel,complete_path,no_dokumen,user_agen,company_agen], (error, results) =>{
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
            // create voyage
            //  var data = "pkk_id="
            // const options = {
            //   hostname: 'localhost:3012/api/V1/insaf/voyage',
            //   port: 3012,
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //     'Content-Length': data.length
            //   }
            // }
            
            // const req = https.request(options, res => {
            //   console.log(`statusCode: ${res.statusCode}`)
            
            //   res.on('data', d => {
            //     process.stdout.write(d)
            //   })
            // })
            
            // req.on('error', error => {
            //   console.error(error)
            // })
            
            // req.write(data)
            // req.end()
            var pkk_id = results.rows[0].id;
            console.log(pkk_id);
            pool.query(`UPDATE tbl_insaf_voyage SET pkk_id=${pkk_id} WHERE id = ${id_voyage};`, (error, results) =>{
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
                  //response.status(200).send({success:true,data:'data voyage berhasil dibuat'})
              }
        
            })

            response.status(200).send({success:true,data:'data pkk berhasil dibuat', pkk_id })
        }
  
      })
   })

 

 
}

const read = async (request, response) => {

    const {page,rows,sortBy,sortDirection} = request.query
    var page_req = parseInt(page || 1)
    var rows_req = parseInt(rows || 10)
    var sort_by_req = sortBy || 'id'
    var sort_direction_req = sortDirection || 'DESC'
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
      var sql = `SELECT * FROM masdex_pkk where is_delete=false ORDER BY ${sort_by_req
        } ${sort_direction_req}`
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
  
     var sql= 'SELECT * FROM masdex_pkk where id=$1 and is_delete=false'
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
    const { mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,dokumen,no_dokumen,user_agen,company_agen } 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

    // pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where id=$1 and is_delete=false', [id], (error, results) => {
    //     if (error) {
    //       throw error
    //     }else{
    //         //console.log(results.rows);
    //     }
        
    // })


    pool.query('SELECT tbl_masdex_telkompel.jenis_telkompel FROM tbl_masdex_pelabuhan INNER JOIN tbl_masdex_telkompel ON tbl_masdex_pelabuhan.telkompel_id = tbl_masdex_telkompel."id" WHERE tbl_masdex_pelabuhan."id" = $1',[pelabuhan_tujuan], (error,results)=> {
      if (error) {
        response.status(201).send(error)
      }

        jenis_telkompel = results.rows[0].jenis_telkompel;
        console.log(jenis_telkompel);
    });

     pool.query('SELECT * FROM tbl_masdex_pkk where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         doc = results.rows[0].dokumen_pkk;
         //console.log(doc);
         var doc_path = __dirname +path.join('/dokumens/pkk/'+ doc);
         //console.log(doc_path);
         if(fs.existsSync(doc_path))
         {
            fs.unlinkSync(doc_path);
            console.log(doc_path);
         }
         var name='';
          if(request.files!==null){
            let sampleFile = request.files.dokumen;
            //  console.log(sampleFile);
            const now = Date.now();
            let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
            complete_path = 'https://api-insafmasdex.disnavpriok.id/api/V1/dokumens/pkk/'+name;
            console.log(complete_path);

            //   //console.log(__dirname);
            sampleFile.mv(path.join(__dirname + '/dokumens/pkk/') + name, function (err) {
                if (err){
                  console.log(err);
                }
                    
            });
          }else{
            name=null;
            complete_path=null;
          }
        //  console.log(name);
            const update_time = new Date;
            pool.query('UPDATE tbl_masdex_pkk SET mmsi=$1, agen_kapal=$2, pelabuhan_asal=$3, pelabuhan_tujuan=$4, pelabuhan_selanjutnya=$5, dermaga_tujuan=$6, area_tambat_tujuan=$7,zona_labuh_tujuan=$8,jenis_muatan=$9,maksimal_draft=$10,eta=$11,etd=$12,jenis_pelayaran=$13,nama_nahkoda=$14,telepon_nahkoda=$15,dokumen_pkk=$16,updated_at=$17,url_pkk=$18,no_dokumen=$19,user_agen=$21,company_agen=$22 where id=$20'
          , [mmsi, agen_kapal, pelabuhan_asal, pelabuhan_tujuan, pelabuhan_selanjutnya, dermaga_tujuan, area_tambat_tujuan,zona_labuh_tujuan,jenis_muatan,maksimal_draft,eta,etd,jenis_pelayaran,nama_nahkoda,telepon_nahkoda,name,update_time,complete_path,no_dokumen,id,user_agen,company_agen], (error, results) =>{
            if (error) {
               throw error
            }else
            {
                response.status(200).send({success:true,data:'data pkk berhasil diperbarui'})
            }
     
          });

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

  pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT p.id, p.no_dokumen,p.created_at as date_pkk, p.nama_nahkoda, p.imo, p.telepon_nahkoda, p.mmsi, p.ship_name, p.gt, p.call_sign, p.ship_type_id, p.ship_type, p.jenis_muatan as payload, lp.nama_pelabuhan as pelabuhan_asal, pt.nama_pelabuhan as pelabuhan_tujuan, ps.nama_pelabuhan as pelabuhan_selanjutnya, ad.nama_dermaga as area_tambat_tujuan, at.nama_area_tambat, p.eta, p.etd, p.created_at, p.updated_at, p.deleted_at, p.is_delete FROM masdex_pkk p left join tbl_masdex_pelabuhan lp on lp.id = p.pelabuhan_asal left join tbl_masdex_pelabuhan pt on pt.id = p.pelabuhan_tujuan left join tbl_masdex_pelabuhan ps on ps.id = p.pelabuhan_selanjutnya left join tbl_masdex_dermaga ad on ad.id = p.area_tambat_tujuan left join tbl_masdex_area_tambat at on at.id = p.area_tambat_tujuan where p.id=$1 and p.is_delete=false'
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

const download = (request, response) => {
  const filename = request.params.filename;
  console.log(filename);
  var doc_path = __dirname + path.join('/dokumens/pkk/'+ filename);
  console.log(doc_path);
  response.download(doc_path);
  //response.status(200).send({success:true,data:'data berhasil diunduh'})
}


const read_new_notif = (request,response)=>{
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where is_delete=false and new_msg=true', (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_masdex_pkk where is_delete=false and new_msg=true ORDER BY id DESC'
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

  pool.query('SELECT count(*) as total FROM tbl_masdex_pkk where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }else{
        //console.log(results.rows);
        pool.query('SELECT * FROM tbl_masdex_pkk where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }
          // 

          const update_time = new Date;
          pool.query('UPDATE tbl_masdex_pkk SET new_msg=$1,updated_at=$2 where id=$3'
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
                response.status(200).send({success:true,data:'data pkk berhasil diperbarui'})
            }
      
          })


        })
    }
    
})


}

const check_voyage = (request, response) => {

  const id = parseInt(request.params.id);
  //console.log('Here');
  //console.log(id);
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM ship_status_last_status_v2 where mmsi=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT p.voyage_id,p.journal_no,p.ship_status, p.ship_name, p.mmsi, p.gt, p.imo, p.call_sign, p.flag, p.created_at FROM ship_status_last_status_v2 p where p.mmsi=$1 and p.is_delete=false ORDER BY p.voyage_id DESC'
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


module.exports = {
create,
createFromInsaf,
read,
read_by_id,
read_by_voyage,
update,
delete_,
download,
read_new_notif,
update_read_notif,
check_voyage
}