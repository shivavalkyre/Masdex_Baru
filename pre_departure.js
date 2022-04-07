const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const index = (request, response) => {
	var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_clearance_out where radio_on IS NOT NULL AND is_delete=false', (error, results) => {
      if (error) {
        response.status(400).send({success:false, data:error})
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_clearance_out where radio_on IS NOT NULL AND is_delete=false ORDER BY id DESC';
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
	const {voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on, etd_pelabuhan_tujuan, updated_by} = request.body;
	var updated_at = new Date();
	const iddata = request.params.id;
	pool.query(`SELECT COUNT(*) AS total FROM tbl_insaf_clearance_out where voyage_id = $1 and is_delete = 'false';`, [voyage_id], (error, result) =>
	{
		if (error) {
			response.status(400).send({success:false, data:error})
		}
		total = result.rows[0].total;
		if(parseInt(total) == parseInt('1'))
		{
			pool.query(`UPDATE tbl_insaf_clearance_out
						SET voyage_id = $1,
						weather_valid_from = $2,
						weather_valid_to = $3,
						weather_data_feed = $4,
						wind_speed_min = $5,
						wind_speed_max = $6,
						wind_from = $7,
						wind_to = $8,
						humidity_min = $9,
						humidity_max = $10,
						air_pressure = $11,
						temperature_min = $12,
						temperature_max = $13,
						low_tide = $14,
						high_tide = $15,
						low_tide_time = $16,
						high_tide_time = $17,
						weather = $18,
						informasi_cuaca_lainnya = $19,
						informasi_traffic = $20,
						advice_update_ais = $21,
						advice_vts = $22,
						informasi_lainnya = $23,
						radio_on = $24,
						rudder_ok = $25,
						engine_on = $26,
						crew_condition_ok = $27,
						pandu_on = $28,
						etd_pelabuhan_tujuan = $29,
						updated_at = $30,
						updated_by = $31
						WHERE id = $32
						AND is_delete = false;`, [voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on, etd_pelabuhan_tujuan, updated_at, updated_by, iddata], (error, results) => {
				if(error){
					response.status(400).send({success:false,data:error})
				}
				response.status(200).send({success:true, data:'Pre Departure data successfully created'}) 
			})
		}
		else
		{
			response.status(400).send({success:false, data:'Data not found in Database'})
		}
	})
}

const show = (request, response) => {
	const iddata = request.params.id
	var res = []
    var items = []
  
    var sql= 'SELECT * FROM tbl_insaf_clearance_out where id = '+iddata+' and is_delete=false';
    pool.query(sql ,(error, results) => {
       if (error) {
         response.status(400).send({success:false, data:error})
       }
       response.status(200).send({success:true,data:results.rows})
    })
}

const destroy = (request, response) => {
	var updated_at = new Date();
	const iddata = request.params.id;
	
	pool.query(`UPDATE tbl_insaf_clearance_out
				SET weather_valid_from = NULL,
				weather_valid_to = NULL,
				weather_data_feed = NULL,
				wind_speed_min = NULL,
				wind_speed_max = NULL,
				wind_from = NULL,
				wind_to = NULL,
				humidity_min = NULL,
				humidity_max = NULL,
				air_pressure = NULL,
				temperature_min = NULL,
				temperature_max = NULL,
				low_tide = NULL,
				high_tide = NULL,
				low_tide_time = NULL,
				high_tide_time = NULL,
				weather = NULL,
				informasi_cuaca_lainnya = NULL,
				informasi_traffic = NULL,
				advice_update_ais = NULL,
				advice_vts = NULL,
				informasi_lainnya = NULL,
				radio_on = NULL,
				rudder_ok = NULL,
				engine_on = NULL,
				crew_condition_ok = NULL,
				pandu_on = NULL,
				etd_pelabuhan_tujuan = NULL,
				updated_at = $1
				WHERE id = $2
				AND is_delete = false;`, [updated_at, iddata], (error, results) => {
				if(error){
					response.status(400).send({success:false,data:error})
				}
				response.status(200).send({success:true, data:'Pre Departure data successfully deleted'}) 
	})
}

module.exports = {
	index, 
	create,
	show,
	destroy,
}