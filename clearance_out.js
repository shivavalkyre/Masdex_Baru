const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;

const create = (request, response) => {
    const { voyage_id,nomor_spb,tanggal_jam_spb,pelabuhan_tujuan,eta_pelabuhan_tujuan,etd_pelabuhan_tujuan } 
    = request.body

    

    let sampleFile = request.files.dokumen_spb;
    console.log(sampleFile);
     const now = Date.now()
     let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
	 let complete_path = base_url+'dokumens/clearance_out/'+name;
     console.log(__dirname);
     sampleFile.mv(path.join(__dirname + '/dokumens/clearance_out/') + name, function (err) {
         if (err)
             console.log(err);
     });

  

        pool.query('INSERT INTO tbl_insaf_clearance_out (voyage_id,nomor_spb,tanggal_jam_spb,pelabuhan_tujuan,eta_pelabuhan_tujuan,dokumen_spb,etd_pelabuhan_tujuan,url_dokumen_spb) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)'
        , [voyage_id,nomor_spb,tanggal_jam_spb,pelabuhan_tujuan,eta_pelabuhan_tujuan,name,etd_pelabuhan_tujuan,complete_path], (error, results) =>{
          if (error) {
             throw error
            //response.status(201).send(error)
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

  
    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_clearance_out where is_delete=false ORDER BY id ASC'
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
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where id=$1 and is_delete=false', [id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_clearance_out where id=$1 and is_delete=false'
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

  pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where voyage_id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)
   res.push({total:results.rows[0].total})

   var sql= 'SELECT * FROM tbl_insaf_clearance_out where voyage_id=$1 and is_delete=false'
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

const update_operator = (request, response) => {
    const id = parseInt(request.params.id);
    const { voyage_id,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,temperature_min,temperature_max,low_tide,high_tide,weather,informasi_cuaca_lainnya,informasi_traffic,advice_update_ais,advice_vts,informasi_lainnya,radio_on,rudder_ok,crew_condition_ok,pandu_on } 
    = request.body;
    let doc;
    //console.log(mmsi);
    let jenis_telkompel;

    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

    

     pool.query('SELECT * FROM tbl_insaf_clearance_out where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


        //   console.log(name);
         const update_time = new Date;
         pool.query('UPDATE tbl_insaf_clearance_out SET voyage_id=$1,weather_valid_from=$2,weather_valid_to=$3,weather_data_feed=$4,wind_speed_min=$5,wind_speed_max=$6,wind_from=$7,wind_to=$8,humidity_min=$9,humidity_max=$10,temperature_min=$11,temperature_max=$12,low_tide=$13,high_tide=$14,weather=$15,informasi_cuaca_lainnya=$16,informasi_traffic=$17,advice_update_ais=$18,advice_vts=$19,informasi_lainnya=$20,radio_on=$21,rudder_ok=$22,crew_condition_ok=$23,pandu_on=$24,updated_at=$25 where id=$26'
         , [voyage_id,weather_valid_from,weather_valid_to,weather_data_feed,wind_speed_min,wind_speed_max,wind_from,wind_to,humidity_min,humidity_max,temperature_min,temperature_max,low_tide,high_tide,weather,informasi_cuaca_lainnya,informasi_traffic,advice_update_ais,advice_vts,informasi_lainnya,radio_on,rudder_ok,crew_condition_ok,pandu_on,update_time,id], (error, results) =>{
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
               response.status(200).send({success:true,data:'data clearance out berhasil diperbarui'})
           }
     
         })




        });

    
}

const update_ksu = (request, response) => {
	const id = parseInt(request.params.id);
    const { voyage_id,nomor_spb,tanggal_jam_spb,pelabuhan_tujuan,eta_pelabuhan_tujuan,name,etd_pelabuhan_tujuan,complete_path } 
    = request.body

	let doc;

      
	pool.query('SELECT * FROM tbl_insaf_clearance_out where id=$1 and is_delete=false',[id] ,(error, results) => {
		if (error) {
		  throw error
		}

	   doc = results.rows[0].dokumen_spb;
	   var doc_path = __dirname +path.join('/dokumens/clearance_out/'+ doc);
	   console.log(doc_path);
	   if (fs.existsSync(doc_path)){
		fs.unlinkSync(doc_path);
	   }
	   
	   console.log(doc_path);

	   let sampleFile = request.files.dokumen_spb;
	   console.log(sampleFile);
		const now = Date.now()
		let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
		var complete_path = base_url+'dokumens/clearance_in/'+name;
		console.log(__dirname);
		sampleFile.mv(path.join(__dirname + '/dokumens/clearance_in/') + name, function (err) {
			if (err){
			  console.log(err);
			}
				
		});

		console.log(name);
	   const update_time = new Date;
	   pool.query('UPDATE tbl_insaf_clearance_out SET voyage_id=$1,nomor_spb=$2,tanggal_jam_spb=$3,pelabuhan_tujuan=$4,eta_pelabuhan_tujuan=$5,dokumen_spb=$6,etd_pelabuhan_tujuan=$7,url_dokumen_spb=$8 where id=$9'
	   , [voyage_id,nomor_spb,tanggal_jam_spb,pelabuhan_tujuan,eta_pelabuhan_tujuan,name,etd_pelabuhan_tujuan,complete_path,id], (error, results) =>{
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
			 response.status(200).send({success:true,data:'data clearance out berhasil diperbarui'})
		 }
   
	   })

	  });

   
}



const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_insaf_clearance_out where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_insaf_clearance_out SET deleted_at=$1,is_delete=$2 where id=$3'
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
               response.status(200).send({success:true,data:'data clerance out berhasil dihapus'})
           }
     
         })




        });

    
}


const download = (request, response) => {
	const filename = request.params.filename;
	console.log(filename);
	var doc_path = __dirname + path.join('/dokumens/clearance_out/'+ filename);
	console.log(doc_path);
	response.download(doc_path);
	//response.status(200).send({success:true,data:'data berhasil diunduh'})
  };

module.exports = {
    create,
    read,
    read_by_id,
    read_by_voyage_id,
    update_operator,
    update_ksu,
    delete_,
    download,
    }
