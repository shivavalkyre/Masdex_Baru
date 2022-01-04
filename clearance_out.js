const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;

const index = (request, response) => {
	var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where is_delete=false', (error, results) => {
      if (error) {
        response.status(400).send({success:false, data:error})
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT id, voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, created_at, created_by, updated_at, updated_by,url_dokumen_spb FROM tbl_insaf_clearance_out where is_delete=false ORDER BY id ASC';
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

const create = (request, response) => {
	const {voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, created_by} = request.body;
	var created_at = new Date();
	
	pool.query(`SELECT COUNT(*) AS total FROM tbl_insaf_clearance_out where voyage_id = $1 and is_delete = 'false';`, [voyage_id], (error, result) =>
	{
		if (error) {
			response.status(400).send({success:false, data:error})
		}
		total = result.rows[0].total;
		if(parseInt(total) == parseInt('0'))
		{
			let sampleFile = request.files.dokumen_spb;
			//console.log(sampleFile);
			const now = Date.now()
			let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
			var complete_path = base_url+'dokumens/clearance_out/'+name;
			//console.log(__dirname);
			sampleFile.mv(path.join(__dirname + '/dokumens/clearance_out/') + name, function (err) {
				if (err)
				{
					response.status(400).send({success:false,data:err})
				}
			});
			
			pool.query(`INSERT INTO tbl_insaf_clearance_out(voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, created_at, created_by,url_dokumen_spb)
						VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10);`, [voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, created_at, created_by,complete_path], (error, results) => {
				if(error){
					response.status(400).send({success:false,data:error})
				}
				response.status(200).send({success:true, data:'Clearance Out data successfully created'}) 
			})
		}
		else
		{
			response.status(400).send({success:false, data:'Data has been created in Database'})
		}
	})
}

const show = (request, response) => {
	const iddata = request.params.id
	var res = []
    var items = []
  
    var sql= 'SELECT id, voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, created_at, created_by, updated_at, updated_by,url_dokumen_spb FROM tbl_insaf_clearance_out where id = '+iddata+' and is_delete=false';
    pool.query(sql ,(error, results) => {
       if (error) {
         response.status(400).send({success:false, data:error})
       }
       response.status(200).send({success:true,data:results.rows})
    })
}


const show_by_voyage = (request, response) => {
	const iddata = request.params.id
	var res = []
    var items = []
  
    var sql= 'SELECT id, voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, created_at, created_by, updated_at, updated_by,url_dokumen_spb FROM tbl_insaf_clearance_out where voyage_id = '+iddata+' and is_delete=false';
    pool.query(sql ,(error, results) => {
       if (error) {
         response.status(400).send({success:false, data:error})
       }
       response.status(200).send({success:true,data:results.rows})
    })
}



const update = (request, response) => {
	const iddata = request.params.id;
	const {voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, dokumen_spb, updated_by} = request.body;
	var updated_at = new Date();
	if(dokumen_spb != 'kosong'){
		console.log('masuk')
		let sampleFile = request.files.dokumen_spb;
		//console.log(sampleFile);
		const now = Date.now()
		let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
		var complete_path = base_url+'dokumens/clearance_out/'+name;
		//console.log(__dirname);
		sampleFile.mv(path.join(__dirname + '/dokumens/clearance_out/') + name, function (err) {
			if (err)
			{
				console.log(err);
			}
		});
		pool.query(`UPDATE tbl_insaf_clearance_out SET dokumen_spb = $1 WHERE id = $2`, [name, iddata], (error, result) => {
			if(error)
			{
				response.status(400).send({success:false,data:error})
			}
		})
	}
	
	pool.query(`UPDATE tbl_insaf_clearance_out
				SET voyage_id = $1,
				nomor_spb = $2,
				tanggal_jam_spb = $3,
				pandu_on = $4,
				pelabuhan_tujuan = $5,
				eta_pelabuhan_tujuan = $6,
				updated_at = $7, 
				updated_by = $8,
				url_dokumen_spb= $9
				WHERE id = $10
				AND is_delete = false;`, [voyage_id, nomor_spb, tanggal_jam_spb, pandu_on, pelabuhan_tujuan, eta_pelabuhan_tujuan, updated_at, updated_by,complete_path, iddata], (error, results) => {
		if(error){
			response.status(400).send({success:false,data:error})
		}
		response.status(200).send({success:true, data:'Clearance Out data successfully updated'}) 
	})
}

const destroy = (request, response) => {
	const iddata = request.params.id;
	var deleted_at = new Date();
	
	pool.query(`UPDATE tbl_insaf_clearance_out
				SET deleted_at = $1,
				is_delete = true
				WHERE id = $2
				AND is_delete = FALSE`, [deleted_at, iddata], (error, results) => {
		if(error){
			response.status(400).send({success:false,data:error})
		}
		response.status(200).send({success:true, data:'Clearance Out data successfully deleted'}) 
	})
}



const download = (request, response) => {
	const filename = request.params.filename;
	console.log(filename);
	var doc_path = __dirname +path.join('/dokumens/clearance_out/'+ filename);
	console.log(doc_path);
	response.download(doc_path);
  };

module.exports = {
	index, 
	create,
	show,
	show_by_voyage,
	update,
	destroy,
	download
}