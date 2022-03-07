const pool = require('./dbCon');

const createDistress = (request, response) => {
    const {no_jurnal,tanggal,jenis_distress,sumber_informasi,judul_distress, foto_kejadian_distress, deskripsi_assesment, waktu_kejadian, waktu_selesai, degree1, minute1, second1, direction1,degree2, minute2, second2, direction2,lokasi_kejadian,voyage_id} = request.body
    pool.query('INSERT INTO tbl_insaf_distress (no_jurnal,tanggal,jenis_distress,sumber_informasi,judul_distress, foto_kejadian_distress, deskripsi_assesment, waktu_kejadian, waktu_selesai, degree1, minute1, second1, direction1,degree2, minute2, second2, direction2,lokasi_kejadian,voyage_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) ', [no_jurnal,tanggal,parseInt(jenis_distress),parseInt(sumber_informasi),judul_distress, foto_kejadian_distress, deskripsi_assesment, waktu_kejadian, waktu_selesai, degree1, minute1, second1, direction1,degree2, minute2, second2, direction2,lokasi_kejadian,parseInt(voyage_id)], (error, results) => {
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
        pool.query('SELECT id FROM tbl_insaf_distress ORDER BY id DESC LIMIT 1',  (error, results) => {
            if (error) 
            {
                throw error
            }
            response.status(200).send({success:true,data: results.rows[0].id})
        })
      }
      
  })
}

const readDistress = (request, response) => {
    //const { id } = request.body
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_insaf_distress WHERE is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
      res.push({total:results.rows[0].total})
      // var sql=  'SELECT * FROM tbl_insaf_distress WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
      var sql=  'SELECT tbl_insaf_distress.id, tbl_insaf_distress.no_jurnal, tbl_insaf_distress.tanggal, tbl_insaf_jenis_distress.id as id_jenis_distress, tbl_insaf_jenis_distress.jenis_distress, tbl_insaf_distress.sumber_informasi, tbl_insaf_sumber_informasi_awal.sumber_informasi_awal, tbl_insaf_distress.judul_distress, tbl_insaf_distress.lokasi_kejadian, tbl_insaf_distress.foto_kejadian_distress, tbl_insaf_distress.deskripsi_assesment, tbl_insaf_distress.waktu_kejadian, tbl_insaf_distress.waktu_selesai, tbl_insaf_distress.degree1, tbl_insaf_distress.minute1, tbl_insaf_distress.second1, tbl_insaf_distress.direction1, tbl_insaf_distress.degree2, tbl_insaf_distress.minute2, tbl_insaf_distress.second2, tbl_insaf_distress.direction2, tbl_insaf_distress.is_delete FROM tbl_insaf_distress LEFT JOIN tbl_insaf_jenis_distress ON tbl_insaf_distress.jenis_distress = tbl_insaf_jenis_distress.id LEFT JOIN tbl_insaf_sumber_informasi_awal ON tbl_insaf_distress.sumber_informasi = tbl_insaf_sumber_informasi_awal.id WHERE tbl_insaf_distress.is_delete=false ORDER BY tbl_insaf_distress.id ASC'
      pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
          items.push({rows:results.rows})
          res.push(items)
          //response.status(200).send({success:true,data:res})
          response.status(200).send(res)
        })
    })
    
}

const readDistressByID = (request, response) => {
    const id = parseInt(request.params.id)
	var sql = `SELECT tbl_insaf_distress.id, tbl_insaf_distress.no_jurnal, tbl_insaf_distress.tanggal, tbl_insaf_jenis_distress.id as id_jenis_distress, tbl_insaf_jenis_distress.jenis_distress, tbl_insaf_distress.sumber_informasi, tbl_insaf_sumber_informasi_awal.sumber_informasi_awal, tbl_insaf_distress.judul_distress, tbl_insaf_distress.lokasi_kejadian, tbl_insaf_distress.foto_kejadian_distress, tbl_insaf_distress.deskripsi_assesment, tbl_insaf_distress.waktu_kejadian, tbl_insaf_distress.waktu_selesai, tbl_insaf_distress.degree1, tbl_insaf_distress.minute1, tbl_insaf_distress.second1, tbl_insaf_distress.direction1, tbl_insaf_distress.degree2, tbl_insaf_distress.minute2, tbl_insaf_distress.second2, tbl_insaf_distress.direction2, tbl_insaf_distress.is_delete
			   FROM tbl_insaf_distress 
			   LEFT JOIN tbl_insaf_jenis_distress ON tbl_insaf_distress.jenis_distress = tbl_insaf_jenis_distress.id
			   LEFT JOIN tbl_insaf_sumber_informasi_awal ON tbl_insaf_distress.sumber_informasi = tbl_insaf_sumber_informasi_awal.id
			   WHERE tbl_insaf_distress.id= '`+id+`';`
	pool.query(
        sql, (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
		  
            response.status(200).send(results.rows)
        })

}

const updateDistress = (request, response) => {
    const id = request.params.id
    const {no_jurnal,tanggal,jenis_distress,sumber_informasi,judul_distress, foto_kejadian_distress, deskripsi_assesment, waktu_kejadian, waktu_selesai, degree1, minute1, second1, direction1,degree2, minute2, second2, direction2,lokasi_kejadian,voyage_id} = request.body
    var update_at = new Date()
      pool.query(`UPDATE tbl_insaf_distress 
				SET no_jurnal=$1,
				tanggal=$2,
				jenis_distress=$3,
				sumber_informasi=$4,
				judul_distress=$5,
				foto_kejadian_distress=$6,
				deskripsi_assesment=$7, 
				waktu_kejadian=$8, 
				waktu_selesai=$9, 
				degree1=$10, 
				minute1=$11, 
				second1=$12, 
				direction1=$13,
				degree2=$14, 
				minute2=$15, 
				second2=$16, 
				direction2=$17,
				lokasi_kejadian=$18,
				updated_at=$19,
                voyage_id=$20
				WHERE id=$21`, [no_jurnal,tanggal,jenis_distress,sumber_informasi,judul_distress, foto_kejadian_distress, deskripsi_assesment, waktu_kejadian, waktu_selesai, degree1, minute1, second1, direction1,degree2, minute2, second2, direction2,lokasi_kejadian,update_at,voyage_id,id], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({error:'Duplicate data'})
            return;
        }else{
            response.status(400).send({error:error})
        }
      }
      
      pool.query('DELETE FROM tbl_insaf_distress_detail WHERE distress_id = $1 ', [ id], (error, results) => {
        if (error) {
          throw error
        }
        // response.status(200).send({success:true, data:`MSI Detail Has Been Deleted with ID: ${id}`})
      })
      pool.query('DELETE FROM tbl_insaf_pelapor_distress WHERE distress_id = $1 ', [ id], (error, results) => {
        if (error) {
          throw error
        }
        // response.status(200).send({success:true, data:`MSI Detail Has Been Deleted with ID: ${id}`})
      })

      pool.query('SELECT id FROM tbl_insaf_distress where id = $1 ORDER BY id DESC LIMIT 1', [ id], (error, results) => {
          if (error) 
          {
              throw error
          }
          response.status(200).send({success:true,data: results.rows[0].id})
      })
      // response.status(200).send({success:true,data:'Update data success'})

      
  })
}

const deleteDistress = (request, response) => {
    const id = request.params.id
    var delete_at = new Date()
    pool.query('UPDATE tbl_insaf_distress SET deleted_at=$1,is_delete=$2 WHERE id=$3', [delete_at,true,id], (error, results) => {
      if (error) {
        if (error.code == '23505')
        {
            response.status(400).send({error:'Duplicate data'})
            return;
        }else{
            response.status(400).send({error:error})
        }
      }
            response.status(200).send({success:true,data:'Delete data success'})

      
  })
}

const createDistressDetail = (request, response) => {
    const {distress_id, mmsi, pelabuhan_from, pelabuhan_to, status_bernavigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, jumlah_awak_kapal, jumlah_penumpang, jenis_muatan, jenis_bantuan, keterangan_lainnya, penanggulangan_yang_dilakukan, mob_qty, korban_luka_qty, korban_jiwa_qty, kerusakan_kapal, tindakan, need_help, status_upaya, mob_status, korban_luka_status , korban_jiwa_status, voyage_id} = request.body
    pool.query('INSERT INTO tbl_insaf_distress_detail (distress_id, mmsi, pelabuhan_from, pelabuhan_to, status_bernavigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, jumlah_awak_kapal, jumlah_penumpang, jenis_muatan, jenis_bantuan, keterangan_lainnya, penanggulangan_yang_dilakukan, mob_qty, korban_luka_qty, korban_jiwa_qty, kerusakan_kapal, tindakan, need_help, status_upaya, mob_status, korban_luka_status , korban_jiwa_status,voyage_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)'
    , [distress_id, mmsi, pelabuhan_from, pelabuhan_to, status_bernavigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, jumlah_awak_kapal, jumlah_penumpang, jenis_muatan, jenis_bantuan, keterangan_lainnya, penanggulangan_yang_dilakukan, mob_qty, korban_luka_qty, korban_jiwa_qty, kerusakan_kapal, tindakan, need_help, status_upaya, mob_status, korban_luka_status , korban_jiwa_status,voyage_id], (error, results) => {
        if (error) {
          if (error.code == '23505')
          {
              response.status(400).send({error:'Duplicate data'})
              return;
          }else{
              response.status(400).send({error:error})
          }
        }

        response.status(200).send({success:true,data:'Success entry new distress detail'})

    })

}


const readDistressDetailAll = (request, response) => {
  //const { id } = request.body
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 3
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []
  pool.query('SELECT count(*) as total FROM tbl_insaf_distress_detail WHERE is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    res.push({total:results.rows[0].total})
    // var sql=  'SELECT * FROM tbl_insaf_distress WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
    var sql=  'SELECT i.distress_id, k.ship_name FROM tbl_insaf_distress_detail i left join tbl_masdex_kapal k on k.mmsi = i.mmsi  WHERE i.is_delete=false ORDER BY i.id ASC'
    pool.query(
     sql,
      (error, results) => {
        if (error) {
          response.status(400).send({success:false,data:error})
        }
        items.push({rows:results.rows})
        res.push(items)
        //response.status(200).send({success:true,data:res})
        response.status(200).send(res)
      })
  })
  
}

// baca distress_detail berdasarkan distress_id
const readDistressDetail = (request, response) => {
    const { distress_id } = request.body
    //const {page,rows} = request.body
    //var page_req = page || 1
    //var rows_req = rows || 3
    //var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_insaf_distress_detail WHERE distress_id = $1 AND is_delete=false', [distress_id], (error, results) => {
      if (error) {
        throw error
      }
      res.push({total:results.rows[0].total})
      // var sql=  'SELECT * FROM tbl_insaf_distress_detail WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
      var sql=  "SELECT tbl_insaf_distress_detail.id as detail_id, *, tbl_masdex_jenis_kapal.ship_type FROM tbl_insaf_distress_detail LEFT JOIN tbl_masdex_kapal ON tbl_insaf_distress_detail.mmsi = tbl_masdex_kapal.mmsi join tbl_masdex_jenis_kapal on tbl_masdex_jenis_kapal.id = tbl_masdex_kapal.ship_type WHERE tbl_insaf_distress_detail.distress_id = '"+ distress_id +"' AND tbl_insaf_distress_detail.is_delete = false ORDER BY tbl_insaf_distress_detail.id ASC"
	  pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
          items.push({rows:results.rows})
          res.push(items)
          //response.status(200).send({success:true,data:res})
          response.status(200).send(res)
        })
    })
    
}

const readDistressDetailByID = (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id);
    pool.query(
        'SELECT * FROM tbl_insaf_distress_detail WHERE distress_id=$1', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            response.status(200).send({success:true,data:results.rows})
        })

}

const updateDistressDetail = (request, response) => {
    const id = request.params.id
    const {distress_id, mmsi, pelabuhan_from, pelabuhan_to, status_bernavigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, jumlah_awak_kapal, jumlah_penumpang, jenis_muatan, jenis_bantuan, keterangan_lainnya, penanggulangan_yang_dilakukan, mob_qty, korban_luka_qty, korban_jiwa_qty, kerusakan_kapal, tindakan, need_help, status_upaya, mob_status, korban_luka_status , korban_jiwa_status,voyage_id} = request.body
    var update_at = new Date()
    pool.query(`UPDATE tbl_insaf_distress_detail
				SET distress_id = $1,
				mmsi = $2,
				pelabuhan_from = $3,
				pelabuhan_to = $4,
				status_bernavigasi = $5,
				degree1 = $6,
				minute1 = $7,
				second1 = $8,
				direction1 = $9,
				degree2 = $10,
				minute2 = $11,
				second2 = $12,
				direction2 = $13,
				jumlah_awak_kapal = $14,
				jumlah_penumpang = $15,
				jenis_muatan = $16,
				jenis_bantuan = $17,
				keterangan_lainnya = $18,
				penanggulangan_yang_dilakukan = $19,
				mob_qty = $20,
				korban_luka_qty = $21,
				korban_jiwa_qty = $22,
				kerusakan_kapal = $23,
				tindakan = $24,
				need_help = $25,
				status_upaya = $26,
				mob_status = $27,
				korban_luka_status = $28,
				korban_jiwa_status = $29,
                voyage_Id=$30
				WHERE id=$31`, [distress_id, mmsi, pelabuhan_from, pelabuhan_to, status_bernavigasi, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, jumlah_awak_kapal, jumlah_penumpang, jenis_muatan, jenis_bantuan, keterangan_lainnya, penanggulangan_yang_dilakukan, mob_qty, korban_luka_qty, korban_jiwa_qty, kerusakan_kapal, tindakan, need_help, status_upaya, mob_status, korban_luka_status, korban_jiwa_status,voyage_id, id], (error, results) => {
        if (error) {
          if (error.code == '23505')
          {
              response.status(400).send({error:'Duplicate data'})
              return;
          }else{
              response.status(400).send({error:error})
          }
        }

        response.status(200).send({success:true,data:'Success update distress detail'})

    })

}

const deleteDistressDetail = (request, response) => {
    const id = request.params.id
    var delete_at = new Date()
    pool.query('UPDATE tbl_insaf_distress_detail SET deleted_at=$1,is_delete=$2 WHERE id=$3'
    , [delete_at,true,id], (error, results) => {
        if (error) {
          if (error.code == '23505')
          {
              response.status(400).send({error:'Duplicate data'})
              return;
          }else{
              response.status(400).send({error:error})
          }
        }

        response.status(200).send({success:true,data:'Success delete distress detail'})

    })

}


const createPelaporDistress = (request, response) => 
{
    const {distress_id,nama_pelapor,tgl_lapor,info_tambahan, nohp, instansi} = request.body
    pool.query('INSERT INTO tbl_insaf_pelapor_distress (distress_id,nama_pelapor,tgl_lapor,info_tambahan, nohp, instansi) VALUES($1,$2,$3,$4,$5,$6)',[distress_id,nama_pelapor,tgl_lapor,info_tambahan, nohp, instansi], (error, results) => {
        if (error) {
            if (error.code == '23505')
            {
                response.status(400).send({success:false,data:'Duplicate data'})
            }else{
                response.status(400).send({success:false,data:error})
            }
          }
          response.status(200).send({success:true,data:'Success entry new pelapor distress'})
    })
}


const readPelaporDistress = (request, response) => {
    const { distress_id } = request.body
    /* const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req */
    var res = []
    var items = []
    pool.query('SELECT count(*) as total FROM tbl_insaf_pelapor_distress WHERE distress_id = $1 AND is_delete=false', [distress_id], (error, results) => {
      if (error) {
        throw error;
      }
      res.push({total:results.rows[0].total})
      // var sql=  'SELECT * FROM tbl_insaf_pelapor_distress WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
      var sql=  `SELECT * FROM tbl_insaf_pelapor_distress WHERE distress_id = '`+distress_id+`' AND is_delete=false ORDER BY id ASC`
      pool.query(
       sql,
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
          items.push({rows:results.rows})
          res.push(items)
          //response.status(200).send({success:true,data:res})
          response.status(200).send(res)
        })
    })
    
}

const readPelaporDistressByID = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query(
        'SELECT * FROM tbl_insaf_pelapor_distress WHERE id=$1', [id],
        (error, results) => {
          if (error) {
            response.status(400).send({success:false,data:error})
          }
            response.status(200).send({success:true,data:results.rows})
        })

}


const updatePelaporDistress = (request, response) => 
{
    const id = request.params.id
    const {distress_id,nama_pelapor,tgl_lapor,info_tambahan, nohp, instansi} = request.body
	console.log(id)
	pool.query(`UPDATE tbl_insaf_pelapor_distress 
				SET distress_id=$1,
				nama_pelapor=$2,
				tgl_lapor=$3,
				info_tambahan=$4,
				nohp=$5, 
				instansi=$6
				WHERE id=$7;`,[distress_id,nama_pelapor,tgl_lapor,info_tambahan, nohp, instansi,id], (error, results) => {
        if (error) {
            if (error.code == '23505')
            {
                response.status(400).send({success:false,data:'Duplicate data'})
                return;
            }else{
                response.status(400).send({success:false,data:error})
            }
          }
          response.status(200).send({success:true,data:'Success entry new pelapor distress'})
    })
}

const deletePelaporDistress = (request, response) => {
    const id = request.params.id
    var delete_at = new Date()
    pool.query('UPDATE tbl_insaf_pelapor_distress SET deleted_at=$1,is_delete=$2 WHERE id=$3'
    , [delete_at,true,id], (error, results) => {
        if (error) {
          if (error.code == '23505')
          {
              response.status(400).send({error:'Duplicate data'})
              return;
          }else{
              response.status(400).send({error:error})
          }
        }

        response.status(200).send({success:true,data:'Success delete pelapor distress'})

    })

}

  const getJenisDistress = (request, response) =>
  {
	  pool.query(`SELECT id, jenis_distress
				 FROM tbl_insaf_jenis_distress
				 WHERE is_delete = '0'
				 ORDER BY jenis_distress ASC;`, (error, result) => 
				 {
					if (error) 
					{
						throw error;
					}
					response.status(200).json(result.rows)
				 })
  }

  // participant
  const getAllpartisipanBydistressid = (request, response) =>
  {
	const distressid = request.params.distressid;	
	var res = []
    var items = []
    pool.query(`SELECT COUNT(*) as total 
				FROM tbl_insaf_distress_chat_participant
				WHERE tbl_insaf_distress_chat_participant.distress_id = $1;`, [distressid], (error, results) => {
      if (error) {
        throw error
      }
      res.push({total:results.rows[0].total})
      // var sql=  'SELECT * FROM tbl_insaf_distress WHERE is_delete=false ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
      pool.query(`SELECT * 
				FROM tbl_insaf_distress_chat_participant
				WHERE tbl_insaf_distress_chat_participant.distress_id = $1;`, [distressid], (error, result) => 
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
	  const distress_id = request.params.distressid
	  const { username, roomname, user_id, email } = request.body
    var is_osc=0;

	  pool.query(`INSERT INTO tbl_insaf_distress_chat_participant (distress_id, username, roomname, user_id, is_osc) VALUES ($1,$2, $3, $4, '0')`, [distress_id, username, roomname, parseInt(user_id) ], (error, results) => 
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
         url ='http://chat.disnavpriok.id:3001/room?username='+ username +'&roomname='+roomname+'&osc=0';
       }else{
         url ='http://chat.disnavpriok.id:3001/room?username='+ username +'&roomname='+roomname+'&osc=1';
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
            
            
                    const html_content = '<a href="'+ url +'"><input type="button" value="Distress Chat" /></a>'
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
    createDistress,
    readDistress,
    readDistressByID,
    updateDistress,
    deleteDistress,
    createDistressDetail,
    readDistressDetailAll,
    readDistressDetail,
    readDistressDetailByID,
    updateDistressDetail,
    deleteDistressDetail,
    createPelaporDistress,
    readPelaporDistress,
    readPelaporDistressByID,
    updatePelaporDistress,
    deletePelaporDistress,
	getJenisDistress, 
  storePartisipanChatroom,
  getAllpartisipanBydistressid
  }
