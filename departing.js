const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const index = (request, response) => {
	var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_departing where is_delete=false', (error, results) => {
      if (error) {
        response.status(400).send({success:false, data:error})
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_insaf_departing where is_delete=false ORDER BY id ASC';
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
	const {voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on, created_by} = request.body;
	var created_at = new Date();
	pool.query(`SELECT COUNT(*) AS total FROM tbl_insaf_departing where voyage_id = $1 and is_delete = 'false';`, [voyage_id], (error, result) =>
	{
		if (error) {
			response.status(400).send({success:false, data:error})
		}
		total = result.rows[0].total;
		if(parseInt(total) == parseInt('0'))
		{
			pool.query(`INSERT INTO tbl_insaf_departing(voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on,  created_at, created_by)
						VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30);`, [voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on,  created_at, created_by], (error, results) => {
				if(error){
					response.status(400).send({success:false,data:error})
				}
				response.status(200).send({success:true, data:'Departing data successfully created'}) 
			})
		}
		else
		{
			response.status(400).send({success:false, data:'Data has been created in Database'})
		}
	})
}

const update = (request, response) => {
	const {voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on,  updated_by} = request.body;
	var updated_at = new Date();
	const iddata = request.params.id;
	pool.query(`SELECT COUNT(*) AS total FROM tbl_insaf_departing where voyage_id = $1 and is_delete = 'false';`, [voyage_id], (error, result) =>
	{
		if (error) {
			response.status(400).send({success:false, data:error})
		}
		total = result.rows[0].total;
		if(parseInt(total) == parseInt('1'))
		{
			pool.query(`UPDATE tbl_insaf_departing
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
						updated_at = $29,
						updated_by = $30
						WHERE id = $31
						AND is_delete = false;`, [voyage_id, weather_valid_from, weather_valid_to, weather_data_feed, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, informasi_cuaca_lainnya, informasi_traffic, advice_update_ais, advice_vts, informasi_lainnya, radio_on, rudder_ok, engine_on, crew_condition_ok, pandu_on,  updated_at, updated_by, iddata], (error, results) => {
				if(error){
					response.status(400).send({success:false,data:error})
				}
				response.status(200).send({success:true, data:'Departing data successfully updated'}) 
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
  
    var sql= 'SELECT * FROM tbl_insaf_departing where id = '+iddata+' and is_delete=false';
    pool.query(sql ,(error, results) => {
       if (error) {
         response.status(400).send({success:false, data:error})
       }
       response.status(200).send({success:true,data:results.rows})
    })
}

const destroy = (request, response) => {
	const iddata = request.params.id;
	var deleted_at = new Date();
	
	pool.query(`UPDATE tbl_insaf_departing
				SET deleted_at = $1,
				is_delete = true
				WHERE id = $2
				AND is_delete = FALSE`, [deleted_at, iddata], (error, results) => {
		if(error){
			response.status(400).send({success:false,data:error})
		}
		response.status(200).send({success:true, data:'Departing data successfully deleted'}) 
	})
}

module.exports = {
	index, 
	create,
	show,
	update,
	destroy,
}