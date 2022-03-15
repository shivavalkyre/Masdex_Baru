const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const nodemailer = require('nodemailer');
const base_url = process.env.base_url

const create = (request, response) => {
    const created_time = new Date;
    const {tanggal_kejadian, judul_tmas, penanggung_jawab, deskripsi_umum, mmsi, no_telepon_penaggung_jawab, created_by} = request.body
    pool.query('INSERT INTO tbl_masdex_tmas (tanggal_kejadian, judul_tmas, penanggung_jawab, deskripsi_umum, mmsi, no_telepon_penaggung_jawab, created_by, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [tanggal_kejadian, judul_tmas, penanggung_jawab, deskripsi_umum, mmsi, no_telepon_penaggung_jawab, created_by, created_time], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({success:false,data:'Duplicate data'})
            return;
        }else{
          console.log(request.body)
            // throw error;
            response.status(400).send({success:false,data:error})
        }
      }else{
        // response.status(200).send({success:true,data:'Success entry new menu'})  
        pool.query('SELECT id FROM tbl_masdex_tmas ORDER BY id DESC LIMIT 1',  (error, results) => {
            if (error) 
            {
                throw error
            }
            response.status(200).send({success:true,data: results.rows[0].id})
        })
      }
      
  })
}

const read = (request, response) => {

    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []


    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas where is_delete=false', (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT t.*,k.ship_name,k.call_sign,k.imo,k.gt,k.loa,k.width FROM tbl_masdex_tmas t left join tbl_masdex_kapal k on t.mmsi = k.mmsi where t.is_delete=false ORDER BY t.id ASC'
        pool.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            items.push({ rows: results.rows })
            res.push(items)
            response.status(200).send({ success: true, data: res })
        })

    })

}

const readAll = (request, response) => {

    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []


    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas where is_delete=false', (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT t.*,p.nama_pasien,k.ship_name FROM tbl_masdex_tmas t left join tbl_masdex_tmas_pasien p on t.id = p.tmas_id left join tbl_masdex_kapal k on t.mmsi = k.mmsi where t.is_delete=false ORDER BY t.id ASC'
        pool.query(sql, (error, results) => {
            if (error) {
                throw error
            }
            items.push({ rows: results.rows })
            res.push(items)
            response.status(200).send({ success: true, data: res })
        })

    })

}

const read_by_id = (request, response) => {

    const id = parseInt(request.params.id);
    //console.log('Here');
    //console.log(id);
    const { page, rows } = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }
        //console.log(results.rows[0].total)
        res.push({ total: results.rows[0].total })

        var sql = 'SELECT t.*,k.ship_name,k.call_sign,k.imo,k.gt,k.loa,k.flag FROM tbl_masdex_tmas t left join tbl_masdex_kapal k on t.mmsi = k.mmsi where t.id=$1 and t.is_delete=false'
        pool.query(sql, [id], (error, results) => {
            if (error) {
                throw error
            }
            items.push({ rows: results.rows })
            res.push(items)
            response.status(200).send({ success: true, data: res })
        })

    })

}

const update = (request, response) => {
    const id = parseInt(request.params.id);
        const { tanggal_kejadian, judul_tmas, penanggung_jawab, deskripsi_umum, mmsi, no_telepon_penaggung_jawab, updated_by }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })


    pool.query('SELECT * FROM tbl_masdex_tmas where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }

        let name = results.rows[0].logo
        let complete_path = results.rows[0].url_logo

        const update_time = new Date;
        pool.query('UPDATE tbl_masdex_tmas SET tanggal_kejadian=$1, judul_tmas=$2, penanggung_jawab=$3, deskripsi_umum=$4, mmsi=$5, no_telepon_penaggung_jawab=$6, updated_by=$7, updated_at=$8 where id=$9'
            , [tanggal_kejadian, judul_tmas, penanggung_jawab, deskripsi_umum, mmsi, no_telepon_penaggung_jawab, updated_by, update_time, id ], (error, results) => {
                if (error) {
                    throw error
                    //response.status(201).send(error)
                    //console.log(error);
                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {

                    pool.query('DELETE FROM tbl_masdex_tmas_pasien where tmas_id=$1'
                        , [id], (error, results) => {
                            if (error) {
            
                                if (error.code == '23505') {
                                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                                    response.status(400).send('Duplicate data')
                                    return;
                                }
                            } else {
                                
                                pool.query('SELECT id FROM tbl_masdex_tmas where id=$1 LIMIT 1', [id],  (error, results) => {
                                    if (error) 
                                    {
                                        throw error
                                    }
                                    response.status(200).send({success:true,data: results.rows[0].id})
                                })
                                // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
                            }
            
                        })
                }

            })
    });



}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
    
    const { deleted_by }
        = request.body

    pool.query('SELECT count(*) as total FROM tbl_masdex_tmas where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            //console.log(results.rows);
        }

    })

    pool.query('SELECT * FROM tbl_masdex_tmas where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
            throw error
        }


        const deletetime = new Date;
        pool.query('UPDATE tbl_masdex_tmas SET deleted_at=$1,is_delete=$2, deleted_by=$4 where id=$3'
            , [deletetime, true, id, deleted_by], (error, results) => {
                if (error) {

                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {
                    pool.query('UPDATE tbl_masdex_tmas_pasien SET deleted_at=$1,is_delete=$2, deleted_by=$4 where tmas_id=$3'
                        , [deletetime, true, id, deleted_by], (error, results) => {
                            if (error) {
            
                                if (error.code == '23505') {
                                    //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                                    response.status(400).send('Duplicate data')
                                    return;
                                }
                            } else {
                                response.status(200).send({ success: true, data: 'data berhasil dihapus' })
                            }
            
                        })
                }

            })




    });



}

const statusOSC = (request, response) => 
{
    const id = request.params.id;
    pool.query(`SELECT is_osc 
               FROM tbl_masdex_tmas_chat_participant
               WHERE id = $1
               LIMIT 1;`, [id], (error, data) =>
               {
                  statusdata = data.rows[0].is_osc;
                  updatedata = '';
                  if(statusdata == '1')
                  {
                      updatedata = '0';
                  }
                  else
                  {
                      updatedata = '1';
                  }
                   
                  pool.query(`UPDATE tbl_masdex_tmas_chat_participant
                              SET is_osc = $1
                              WHERE id = $2;`, [updatedata, id], (error, result) =>
                              {
                                  if(error)
                                  {
                                      throw error;
                                  }
                                  response.status(200).send({success:true,data:updatedata})
                              }
                  )
               }
    )
}

const getOSC = (request, response) =>
{
  const {username,roomname} = request.body;

  pool.query('SELECT is_osc FROM tbl_masdex_tmas_chat_participant WHERE username = $1 AND roomname= $2', [username,roomname], (error, result) =>
  {
    if(error)
    {
      throw error;
    }
    response.status(200).send({success:true,data:result.rows[0].is_osc})
  })
}


const getShipParticularChat = (request, response) => 
{
    const {roomname} = request.body;
    // 
    //let str = roomname;
    //var start_word = str.indexOf("|");
    //var no_jurnal = String(str.substring(start_word+1));
    var judul_tmas = roomname;
    //console.log(no_jurnal.trim());
    pool.query('SELECT * FROM tbl_masdex_tmas WHERE judul_tmas=$1', [judul_tmas.trim()], (error, result) =>
    {
      if(error)
      {
        throw error;
      }
      response.status(200).send({success:true,data:result.rows})
    });
    //response.status(200).send({success:true,data:str.substring(start_word+1)})
}

const getShipParticularTMAS = (request, response) => 
{
  const id = parseInt(request.params.id);
  //console.log(id);
  pool.query('SELECT ship_name FROM masdex_ship_particular_tmas WHERE tmas_id=$1', [id], (error, result) =>
  {
    if(error)
    {
      throw error;
    }
    response.status(200).send({success:true,data:result.rows})
  });
}

const getTMASidbyRoomname = (request, response) =>{
  const {roomname} = request.body;
  pool.query('SELECT tmas_id FROM tbl_masdex_tmas_chat_participant WHERE roomname= $1', [roomname], (error, result) =>
  {
    if(error)
    {
      throw error;
    }
    response.status(200).send({success:true,data:result.rows[0].tmas_id})
  })
}

const endTMAS = (request, response) =>
{
  const distressid = request.params.id;
  var waktu_selesai = new Date()
  pool.query(`UPDATE tbl_masdex_tmas
  SET waktu_selesai = $1
  WHERE id = $2;`, [waktu_selesai, distressid], (error, result) =>
  {
    if(error)
    {
      throw error;
    }
    response.status(200).send({success:true,data:'distress telah berakhir'})
  }
)

}

// participant
const getAllpartisipanByTMASid = (request, response) =>
{
  const tmasid = request.params.id;	
  var res = []
  var items = []
  pool.query(`SELECT COUNT(*) as total 
              FROM tbl_masdex_tmas_chat_participant
              WHERE tbl_masdex_tmas_chat_participant.tmas_id = $1;`, [tmasid], (error, results) => {
    if (error) {
      throw error
    }
    res.push({total:results.rows[0].total})
    // var sql=  'SELECT * FROM tbl_insaf_distress WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
    pool.query(`SELECT * 
              FROM tbl_masdex_tmas_chat_participant
              WHERE tbl_masdex_tmas_chat_participant.tmas_id = $1;`, [tmasid], (error, result) => 
            {
                  if(error)
                  {
                      response.status(400).json({success:false, data: error})
                  }
                  items.push({rows:result.rows})
                  res.push(items)
                  //response.status(200).send({success:true,data:res})
                  response.status(200).send(res)
            }
    )
  })
}

const storePartisipanChatroom = (request, response) => 
{
    const id = request.params.id
    const { username, roomname, user_id, email } = request.body
  var is_osc=0;

    pool.query(`INSERT INTO tbl_masdex_tmas_chat_participant (tmas_id, username, roomname, user_id, is_osc) VALUES ($1,$2, $3, $4, '0')`, [id, username, roomname, parseInt(user_id) ], (error, results) => 
      {
          //console.log(results)
        if (error) {
          if (error.code == '23505')
          {
              response.status(400).send({success:false,data:'Duplicate data'})
              return;
          }else{
              response.status(400).send({success:false,data:error})
          }
        }else{
          // response.status(200).send({success:true,data: 'Data saved in database'})
    // generate link di ubah sesuai kebutuhan
    var url='';
     if (parseInt(is_osc)===0){
          url ='http://chat-tmas.disnavpriok.id/room?username='+ username +'&roomname='+roomname+'&osc=0';
          // url ='http://localhost:3014/room?username='+ username +'&roomname='+roomname+'&osc=0';
     }else{
          url ='http://chat-tmas.disnavpriok.id/room?username='+ username +'&roomname='+roomname+'&osc=1';
          // url ='http://localhost:3014/room?username='+ username +'&roomname='+roomname+'&osc=1';
     }

        // send email activation ================================================================
        //const transporter = nodemailer.createTransport({
        //  host: 'smtp.mailtrap.io',
        //  port: 2525,
        //  ssl: false,
        //  tls: true,
        //  auth: {
        //    user: 'fa78221d8b890e',
        //    pass: 'a5b8b160501000'
        //  }
        //});

        // send email forgot password ================================================================
          const transporter = nodemailer.createTransport({
            host: 'srv115.niagahoster.com',
            port: 465,
            ssl: false,
            tls: true,
            auth: {
              user: 'admin.insaf@disnavpriok.id',
              pass: 'dispriok123'
            }
          });
          
          const html_content = '<a href="'+ url +'"><input type="button" value="TMAS Chat" /></a>'
          const mailOptions = {
            from: 'admin.insaf@disnavpriok.id',
            to: email,
            subject: roomname,
            html: html_content
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              response.status(200).send({success:true,data:'Email activation was sent'})
            }
          });

        }
      }
    )
}

module.exports = {
    create,
    read,
    read_by_id,
    update,
    delete_,
    readAll,
    getOSC,
    statusOSC,
    getShipParticularChat,
    getShipParticularTMAS,
    getTMASidbyRoomname,
    endTMAS,
    getAllpartisipanByTMASid,
    storePartisipanChatroom,
}