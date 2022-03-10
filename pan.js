const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')



/*
	will we need authentification or not ?
*/

// get all PAN data
const getPAN = (request, response) => {
	const { page, rows } = request.body
	// to be continue
	var page_req = page || 1
	var rows_req = rows || 3
	var offset = (page_req - 1) * rows_req
	var res = []
	var items = []
	pool.query('SELECT COUNT(*) AS total FROM insaf_panxjenispanxsumberinformasiawal;', (error, results) => {
		if (error) {
			throw error
		}
		res.push({ total: results.rows[0].total })
		var sql = "SELECT * FROM insaf_panxjenispanxsumberinformasiawal ORDER BY id ASC;";
		pool.query(sql, (error, results2) => {
			if (error) {
				response.status(400).send({ success: false, data: error })
			}
			items.push({ rows: results2.rows })
			res.push(items)
			response.status(200).send(res)
		})
	})
}

// get all PAN data order by created_at
const getPANorderBY = (request, response) => {
	const target = request.params.target
	// to be continue
	const { page, rows } = request.body
	var page_req = page || 1
	var rows_req = rows || 3
	var offset = (page_req - 1) * rows_req
	var res = []
	var items = []
	pool.query('SELECT COUNT(*) AS total FROM insaf_panxjenispanxsumberinformasiawal;', (error, results) => {
		if (error) {
			throw error
		}
		res.push({ total: results.rows[0].total })
		filter = ''
		if (target == 'desc') {
			filter = 'DESC'
		}
		else {
			filter = 'ASC'
		}
		var sql = "SELECT * FROM insaf_panxjenispanxsumberinformasiawal ORDER BY created_at " + filter + ";";
		pool.query(sql, (error, results2) => {
			if (error) {
				response.status(400).send({ success: false, data: error })
			}
			items.push({ rows: results2.rows })
			res.push(items)
			response.status(200).send(res)
		})
	})
}

// store data for tbl_insaf_pan only
const storePAN = (request, response) => {
	const
		{
			no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan, created_at, created_by
		} = request.body

	// check if data exist
	pool.query(`SELECT COUNT(*) FROM tbl_insaf_pan 
				WHERE no_jurnal = $1
				AND jenis_pan = $2
				AND waktu_kejadian = $3
				AND sumber_informasi = $4
				AND keterangan_lainnya = $5
				AND deskripsi_laporan = $6
				AND degree1 = $7
				AND minute1 = $8
				AND second1 = $9
				AND direction1 = $10
				AND degree2 = $11
				AND minute2 = $12
				AND second2 = $13
				AND direction2 = $14
				AND master_onboard = $15 
				AND phone_onboard = $16 
				AND second_officer = $17 
				AND phone_second_officer = $18 
				AND tanggal = $19
				AND memerlukan_tindakan = $20
				AND is_delete = '0';`, [no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan], (error, cekdata) => {
		if (error) {
			// throw error
			response.status(201).send(error)
		}
		totaldata = cekdata.rows[0].count;
		if (totaldata != 0) {
			response.status(400).send({ success: false, data: 'Tidak bisa memproses data. Data sudah tersimpan dalam database' })
		}
		else {
			pool.query(`INSERT INTO tbl_insaf_pan (no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan, created_at, created_by)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22);`, [no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan, created_at, created_by], (error, results) => {
				if (error) {
					// throw error
					response.status(201).send(error)
				}
				pool.query('SELECT id FROM tbl_insaf_pan ORDER BY id DESC LIMIT 1', (error, results) => {
					if (error) {
						throw error
					}
					response.status(200).send({ success: true, message: "Data PAN berhasil bertambah", last_id: results.rows[0].id })
				})

			}
			)
		}
	}
	)
}

// get PAN data by id
const getPANbyId = (request, response) => {
	const id = parseInt(request.params.id);

	pool.query('SELECT * FROM insaf_panxjenispanxsumberinformasiawal WHERE id = $1;', [id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows)
	})
}

// get PAN data by id
const getPANbyVoyage = (request, response) => {
	const id = parseInt(request.params.id);

	pool.query('SELECT * FROM insaf_panxjenispanxsumberinformasiawal WHERE voyage_id = $1;', [id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows)
	})
}

// get PAN data by Range date
const getPANByRange = (request, response) => {
	const range1 = request.params.range1
	const range2 = request.params.range2
	// to be continue
	const { page, rows } = request.body
	var page_req = page || 1
	var rows_req = rows || 3
	var offset = (page_req - 1) * rows_req
	var res = []
	var items = []
	pool.query('SELECT COUNT(*) AS total FROM insaf_panxjenispanxsumberinformasiawal WHERE waktu_kejadian >= $1 AND waktu_kejadian <= $2;', [range1, range2], (error, results) => {
		if (error) {
			throw error
		}
		res.push({ total: results.rows[0].total })
		var sql = "SELECT * FROM insaf_panxjenispanxsumberinformasiawal WHERE waktu_kejadian >= '" + range1 + "' AND waktu_kejadian <= '" + range2 + "'" + " ORDER BY id ASC";
		pool.query(sql, (error, results2) => {
			if (error) {
				response.status(400).send({ success: false, data: error })
			}
			items.push({ rows: results2.rows })
			res.push(items)
			response.status(200).send(res)
		})
	})
}

// delete PAN data by id
const destroyPAN = (request, response) => {
	const id = parseInt(request.params.id);

	pool.query(`SELECT COUNT(*) FROM tbl_insaf_pan 
				WHERE id = $1
				AND is_delete = '0';`, [id], (error, cekdata) => {
		if (error) {
			// throw error
			response.status(201).send(error)
		}

		totaldata = cekdata.rows[0].count;
		if (totaldata == 0) {
			response.status(400).send('Tidak bisa memproses data. Data yang anda cari tidak ditemukan dalam database')
		}
		else {
			pool.query(`UPDATE tbl_insaf_pan 
							SET is_delete = '1' 
							WHERE id = $1;`, [id], (error, results) => {
				if (error) {
					// throw error
					response.status(201).send(error)
				}

				response.status(200).send({ success: true, data: "Data yang anda pilih berhasil dihapus" });
			}
			)
		}
	}
	)
}

// update data for tbl_insaf_pan only
const updatePAN = (request, response) => {
	const id = parseInt(request.params.id);

	const
		{
			no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan, updated_at, updated_by
		} = request.body

	// check if data exist
	pool.query(`SELECT COUNT(*) FROM tbl_insaf_pan 
				WHERE no_jurnal = $1
				AND jenis_pan = $2
				AND waktu_kejadian = $3
				AND sumber_informasi = $4
				AND keterangan_lainnya = $5
				AND deskripsi_laporan = $6
				AND degree1 = $7
				AND minute1 = $8
				AND second1 = $9
				AND direction1 = $10
				AND degree2 = $11
				AND minute2 = $12
				AND second2 = $13
				AND direction2 = $14
				AND master_onboard = $15 
				AND phone_onboard = $16 
				AND second_officer = $17 
				AND phone_second_officer = $18
				AND tanggal = $19
				AND memerlukan_tindakan = $20
				AND id <> $21
				AND is_delete = '0';`, [no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan, id], (error, cekdata) => {
		if (error) {
			// throw error
			response.status(201).send(error)
		}
		totaldata = cekdata.rows[0].count;
		if (totaldata != 0) {
			response.status(400).send('Tidak bisa memproses data. Data sudah tersimpan dalam database')
		}
		else {
			pool.query(`UPDATE tbl_insaf_pan 
							SET no_jurnal = $1,
							jenis_pan = $2,
							waktu_kejadian = $3,
							sumber_informasi = $4,
							keterangan_lainnya = $5,
							deskripsi_laporan = $6,
							degree1 = $7,
							minute1 = $8,
							second1 = $9,
							direction1 = $10,
							degree2 = $11,
							minute2 = $12,
							second2 = $13,
							direction2 = $14,
							master_onboard = $15,
							phone_onboard = $16,
							second_officer = $17,
							phone_second_officer = $18,
							tanggal = $19,
							memerlukan_tindakan = $20,
							updated_at = $22, 
							updated_by = $23
							WHERE id = $21
							AND is_delete = '0';`, [no_jurnal, jenis_pan, waktu_kejadian, sumber_informasi, keterangan_lainnya, deskripsi_laporan, degree1, minute1, second1, direction1, degree2, minute2, second2, direction2, master_onboard, phone_onboard, second_officer, phone_second_officer, tanggal, memerlukan_tindakan, id, updated_at, updated_by], (errors, results) => {
				if (errors) {
					throw errors
				}

				response.status(200).send({ success: true, data: "Data yang anda pilih berhasil update" });
			}
			)
		}
	}
	)
}

// get PAN data by keyword
const searchPANdata = (request, response) => {
	const keyword = request.params.keyword
	// to be continue
	const { page, rows } = request.body
	var page_req = page || 1
	var rows_req = rows || 3
	var offset = (page_req - 1) * rows_req
	var res = []
	var items = []
	var queryfilter = '%' + keyword + '%'
	pool.query('SELECT COUNT(*) AS total FROM insaf_panxjenispanxsumberinformasiawal WHERE no_jurnal ILIKE $1;', [queryfilter], (error, results) => {
		if (error) {
			throw error
		}
		res.push({ total: results.rows[0].total })
		var sql = "SELECT * FROM insaf_panxjenispanxsumberinformasiawal WHERE no_jurnal ILIKE '" + queryfilter + "' ORDER BY id ASC;";
		pool.query(sql, (error, results2) => {
			if (error) {
				response.status(400).send({ success: false, data: error })
			}
			items.push({ rows: results2.rows })
			res.push(items)
			response.status(200).send(res)
		})
	})
}

// get all PAN detail data based on pan_id
const getPANdetail = (request, response) => {
	const id = parseInt(request.params.id);
	pool.query(`SELECT * FROM insaf_pandetailxmasdexkapal WHERE pan_id = $1 AND is_delete =$2;`, [id, false], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows)
	})
}

// get all PAN detail data based on pan_id
const getPANdetailAll = (request, response) => {
	// const id = parseInt(request.params.id);
	pool.query(`SELECT * FROM insaf_pandetailxmasdexkapal WHERE is_delete =$1;`, [false], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows)
	})
}

// get latest PAN data order by id
const getLatestPAN = (request, response) => {
	pool.query(`SELECT no_jurnal, id
				 FROM tbl_insaf_pan
				 WHERE is_delete = '0'
				 ORDER BY id DESC
				 LIMIT 1;`, (error, results) => {
		if (error) {
			throw error;
		}
		// perbaiki lagi disini
		console.log(results.rows)
		latestpan = "";
		id = '';
		if (results.rows == '') {
			result = parseInt('1');
			id = 1;
		}
		else {
			result = parseInt(results.rows[0].no_jurnal) + parseInt("1");
			id = results.rows[0].id;
		}

		if (result < parseInt("10")) {
			latestpan = "00" + result;
		}
		else if (result < parseInt("100")) {
			latestpan = "0" + result;
		}
		else {
			latestpan = result;
		}
		response.status(200).json({ 'no_jurnal': latestpan, 'id': id })
	})
}

// store PAN detail data based on pan_id
const storePANdetail = (request, response) => {
	const id = parseInt(request.params.id);
	const { mmsi, voyage_id } = request.body;
	// check data if exist
	pool.query(`INSERT INTO tbl_insaf_pan_detail (pan_id, mmsi,voyage_id) VALUES ($1, $2,$3);`, [id, mmsi, voyage_id], (error, results) => {
		if (error) {
			response.status(400).json(error)
		}
		response.status(200).json("Data kapal berhasil bertambah")
	})
}

// update PAN detail data based on pan_id
const updatePANdetail = (request, response) => {
	const pan_id = parseInt(request.params.pan_id);
	const pan_detail_id = parseInt(request.params.pan_detail_id);
	const { mmsi, voyage_id } = request.body;
	pool.query(`UPDATE tbl_insaf_pan_detail 
				 SET mmsi = $1 ,voyage_id=$2
				 WHERE pan_id = $3
				 AND id = $4
				 AND is_delete = '0';`, [mmsi, voyage_id, pan_id, pan_detail_id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json("Data kapal berhasil update")
	})
}

// delete PAN detail data based on pan_id and pan_detail_id
const destroyPANdetail = (request, response) => {
	const pan_id = parseInt(request.params.pan_id);
	const pan_detail_id = parseInt(request.params.pan_detail_id);
	pool.query(`UPDATE tbl_insaf_pan_detail 
				 SET is_delete = '1'
				 WHERE pan_id = $1
				 AND id = $2;`, [pan_id, pan_detail_id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json("Data pan berhasil dihapus")
	})
}

// delete PAN and detail based on pan_id
const destroyPANandDetailPAN = (request, response) => {
	const pan_id = parseInt(request.params.pan_id);
	pool.query(`UPDATE tbl_insaf_pan_detail 
				 SET is_delete = '1'
				 WHERE pan_id = $1;`, [pan_id], (error, results) => {
		if (error) {
			console.log(error)
		}
		response.status(200).json("Data PAN berhasil dihapus")
	})

	pool.query(`UPDATE tbl_insaf_pan SET is_delete = '1' WHERE id = $1;`, [pan_id], (error2, results2) => {
		if (error2) {
			console.log(error2)
		}
		response.status(200).json("Data PAN berhasil dihapus")
	})
}

// get PAN detail data based on pan_id and id
// use this function when to check tbl_insaf_pan_detail data exist based on pan_id and id
const getPANdetailbyId = (request, response) => {
	const pan_id = parseInt(request.params.pan_id);
	const pan_detail_id = parseInt(request.params.pan_detail_id);
	pool.query(`SELECT mmsi,voyage_id
				 FROM tbl_insaf_pan_detail 
				 WHERE pan_id = $1
				 AND id = $2
				 AND is_delete = '0'
				 LIMIT 1;`, [pan_id, pan_detail_id], (error, result) => {
		if (error) {
			throw error;
		}
		mmsi = result.rows[0].mmsi;
		pool.query(`SELECT mmsi, imo, ship_name, call_sign, flag, length, width, sensor_type
				 FROM tbl_masdex_kapal 
				 WHERE mmsi = $1
				 AND is_delete = '0'
				 LIMIT 1;`, [mmsi], (errors, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json(results.rows)
		}
		)
	})
}

// get PAN detail data based on pan_id
// use this function when to check tbl_insaf_pan_detail data exist based on pan_id
const getPANdetailbyPANId = (request, response) => {
	const pan_detail_id = parseInt(request.params.pan_detail_id);
	pool.query(`SELECT tbl_insaf_pan_detail.id, tbl_insaf_pan_detail.pan_id, tbl_masdex_kapal.mmsi, tbl_masdex_jenis_kapal.ship_type, tbl_masdex_kapal.imo, tbl_masdex_kapal.gt, tbl_masdex_kapal.ship_name, tbl_masdex_kapal.call_sign, tbl_masdex_kapal.flag, tbl_masdex_kapal.length, tbl_masdex_kapal.width, tbl_masdex_kapal.sensor_type FROM tbl_masdex_kapal
	JOIN tbl_insaf_pan_detail ON tbl_masdex_kapal.mmsi = tbl_insaf_pan_detail.mmsi
	JOIN tbl_masdex_jenis_kapal ON tbl_masdex_kapal.ship_type = tbl_masdex_jenis_kapal.id
	WHERE tbl_insaf_pan_detail.pan_id = $1 AND tbl_insaf_pan_detail.is_delete = '0';`, [pan_detail_id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows)
	}
	)
}

// get PAN detail data based on pan_id
// use this function when to check tbl_insaf_pan_detail data exist based on pan_id
const showPANdetailByPANid = (request, response) => {
	const pan_detail_id = parseInt(request.params.pan_detail_id);
	pool.query(`SELECT tbl_insaf_pan.no_jurnal, tbl_insaf_pan.waktu_kejadian, tbl_insaf_pan.degree1, tbl_insaf_pan.minute1, tbl_insaf_pan.second1, tbl_insaf_pan.direction1, tbl_insaf_pan.degree2, tbl_insaf_pan.minute2, tbl_insaf_pan.second2, tbl_insaf_pan.direction2, tbl_insaf_pan.memerlukan_tindakan, tbl_insaf_jenis_pan.jenis_pan, tbl_insaf_sumber_informasi_awal.sumber_informasi_awal, tbl_insaf_pan.keterangan_lainnya, tbl_insaf_pan.master_onboard, tbl_insaf_pan.phone_onboard, tbl_insaf_pan.second_officer, tbl_insaf_pan.phone_second_officer
	FROM tbl_insaf_pan JOIN tbl_insaf_jenis_pan ON tbl_insaf_pan.jenis_pan = tbl_insaf_jenis_pan.id
	JOIN tbl_insaf_sumber_informasi_awal ON tbl_insaf_pan.sumber_informasi = tbl_insaf_sumber_informasi_awal.id
	WHERE tbl_insaf_pan.id = $1
	AND tbl_insaf_pan.is_delete = '0'
	LIMIT 1;`, [pan_detail_id], (error, result) => {
		if (error) {
			throw error;
		}
		pool.query(`SELECT tbl_insaf_pan_detail.id, tbl_insaf_pan_detail.pan_id, tbl_masdex_kapal.mmsi, tbl_masdex_jenis_kapal.ship_type, tbl_masdex_kapal.imo, tbl_masdex_kapal.gt, tbl_masdex_kapal.ship_name, tbl_masdex_kapal.call_sign, tbl_masdex_kapal.flag, tbl_masdex_kapal.length, tbl_masdex_kapal.width, tbl_masdex_kapal.sensor_type FROM tbl_masdex_kapal
		JOIN tbl_insaf_pan_detail ON tbl_masdex_kapal.mmsi = tbl_insaf_pan_detail.mmsi
		JOIN tbl_masdex_jenis_kapal ON tbl_masdex_kapal.ship_type = tbl_masdex_jenis_kapal.id
		WHERE tbl_insaf_pan_detail.pan_id = $1 AND tbl_insaf_pan_detail.is_delete = '0';`, [pan_detail_id], (error, results) => {
			if (error) {
				throw error;
			}
			response.status(200).json({
				success: true,
				data: results.rows,
				detail: result.rows
			})
		}
		)
	})
}

/*
  get all basic data when user want to create or update PAN data
*/

const getSumberInformasiAwal = (request, response) => {
	pool.query(`SELECT id, sumber_informasi_awal
				 FROM tbl_insaf_sumber_informasi_awal 
				 WHERE is_delete = '0'
				 ORDER BY sumber_informasi_awal ASC;`, (error, result) => {
		if (error) {
			throw error;
		}
		response.status(200).json(result.rows)
	})
}

const getJenisPan = (request, response) => {
	pool.query(`SELECT id, jenis_pan
				 FROM tbl_insaf_jenis_pan
				 WHERE is_delete = '0'
				 ORDER BY jenis_pan ASC;`, (error, result) => {
		if (error) {
			throw error;
		}
		response.status(200).json(result.rows)
	})
}

module.exports = {
	getPAN,
	getPANorderBY,
	storePAN,
	getPANbyId,
	getPANbyVoyage,
	destroyPAN,
	updatePAN,
	getPANByRange,
	getPANdetail,
	getPANdetailbyPANId,
	storePANdetail,
	updatePANdetail,
	destroyPANdetail,
	destroyPANandDetailPAN,
	getPANdetailbyId,
	searchPANdata,
	getLatestPAN,
	getSumberInformasiAwal,
	getJenisPan,
	showPANdetailByPANid,
	getPANdetailAll,
}