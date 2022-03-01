const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const createMSI = (request, response) => {
    const { no_jurnal, news_title, msi_category, voyage_id, valid_from, valid_to, information, sumber_data, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, additional_info} 
    = request.body
    pool.query('INSERT INTO tbl_insaf_msi (no_jurnal, news_title, msi_category, voyage_id, valid_from, valid_to, information, sumber_data, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, additional_info ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)'
    , [no_jurnal, news_title, msi_category, voyage_id, "'"+valid_from+"'","'"+valid_to+"'", information, sumber_data, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, additional_info], (error, results) =>{
      console.log(no_jurnal, news_title, msi_category, voyage_id, "'"+valid_from+"'","'"+valid_to+"'", information, sumber_data, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, additional_info)
      if (error) {
        // throw error
        response.status(400).send(error)
        if (error.code == '23505')
        {
            //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
            response.status(400).send({succes:false, data:`Duplicat Data`})
            return;
        }
      }
  
      pool.query('SELECT id FROM tbl_insaf_msi ORDER BY id DESC limit 1', (error1, results1) => {
        if (error1) {
          throw error1
        }
        else{
          var myid = results1.rows[0].id;
        }
    
        response.status(200).send({succes:true, data: myid})
      })
    })
  }
  
  const createMSIDetail = (request, response) => {
    const {msi_id, user_id} = request.body
    var created_at = new Date()
    pool.query('INSERT INTO tbl_insaf_msi_detail (msi_id, user_id, created_at) VALUES ($1, $2, $3)'
    , [msi_id, user_id, created_at], (error, results) =>{
  
      if (error) {
        // throw error
        response.status(400).send(error)
        if (error.code == '23505')
        {
            response.status(400).send({succes:false, data:`Duplicat Data`})
            return;
        }
      }
  
        response.status(200).send({succes:true, data: `MSI detail added Successfuly `})
    })
  }
  
  // const getMSI = (request, response) => {
  //   pool.query('SELECT * FROM tbl_insaf_msi_detail ORDER BY id ASC', (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     response.status(200).json(results.rows)
  //   })
  // }
  
  const getMSI = (request, response) => {
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    pool.query('SELECT count(*) as total FROM tbl_insaf_msi  WHERE is_delete = false', (error, results) => {
      if (error) {
        throw error
      }
    //  console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
    //  var sql= 'SELECT * FROM tbl_insaf_msi ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
     var sql= 'SELECT * FROM tbl_insaf_msi WHERE is_delete = false ORDER BY id ASC'
  
  
    //  var sql= 'SELECT * FROM insaf_msixmsidetail ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset (INFORMASI KAPAL)
  
    //  response.status(200).send(sql)
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       //response.status(200).send({success:true,data:res})
       response.status(200).send(res)
     })
  
    })
  
  }
  
  const getMSIByRange = (request, response) => {
    const {range1,range2, page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 3
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    // var sql= 'SELECT COUNT(*) as total FROM tbl_insaf_msi WHERE tanggal >='+ " '"+range1 +"'"+ ' AND tanggal <= '+ "'"+range2+"'" +' LIMIT ' + rows_req + ' OFFSET ' + offset
    var sql= 'SELECT COUNT(*) as total FROM tbl_insaf_msi WHERE created_at >='+ " '"+range1 +"'"+ ' AND created_at <= '+ "'"+range2+"'"
    pool.query(sql ,(error, results) => {
      if (error) {
        throw error
      }
    //  console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
    //  var sql= 'SELECT * FROM insaf_msixmsidetail ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
    //  var sql= 'SELECT * FROM insaf_msixmsidetail WHERE created_at >='+ " '"+range1 +"'"+ ' AND created_at <= '+ "'"+range2+"'" +' ORDER BY id ASC'
     var sql= 'SELECT * FROM tbl_insaf_msi WHERE created_at >='+ " '"+range1 +"'"+ ' AND created_at <= '+ "'"+range2+"'" +' ORDER BY id ASC'
    //  response.status(200).send(sql)
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       //response.status(200).send({success:true,data:res})
       response.status(200).send(res)
     })
  
    })
  
  }
  
  const getMSIById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM tbl_insaf_msi WHERE id = $1', [id], (error, results) =>  { 
    // pool.query('SELECT * FROM insaf_msixmsidetail WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const updateMSI = (request, response) => {
    const id = parseInt(request.params.id)
    const { no_jurnal, news_title, valid_from, valid_to, information, sumber_data, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, additional_info, voyage_id, msi_category} = request.body
    var updated_at = new Date()
    pool.query(
      'UPDATE tbl_insaf_msi set no_jurnal = $1 , news_title = $2, valid_from = $3, valid_to = $4, information = $5, sumber_data = $6, wind_speed_min = $7, wind_speed_max = $8, wind_from = $9, wind_to = $10, humidity_min = $11, humidity_max = $12, air_pressure = $13, temperature_min = $14, temperature_max = $15, low_tide = $16, high_tide = $17, low_tide_time = $18, high_tide_time = $19, weather = $20, additional_info = $21, updated_at = $22, voyage_id = $23, msi_category = $24 WHERE id = $25',
      [no_jurnal, news_title, valid_from, valid_to, information, sumber_data, wind_speed_min, wind_speed_max, wind_from, wind_to, humidity_min, humidity_max, air_pressure, temperature_min, temperature_max, low_tide, high_tide, low_tide_time, high_tide_time, weather, additional_info, updated_at, voyage_id, msi_category, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send({succes:true, data:`MSI modified with ID: ${id}`})
      }
    )
  }
  
  const updateMSIDetail = (request, response) => {
    const id = parseInt(request.params.id)
    // console.log(id)
    const { user_id } = request.body
    var updated_at = new Date()
    pool.query(
      'UPDATE tbl_insaf_msi_detail set user_id = $1, updated_at = $2 WHERE id = $3',
      [user_id, updated_at, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send({succes:true, data:`MSI Detail modified with ID : ${id}`})
      }
    )
  }
  
  const deleteMSI = (request, response) => {
    var deleted_at = new Date()
    const id = parseInt(request.params.id)
    pool.query('UPDATE tbl_insaf_msi set is_delete = true, deleted_at = $1  WHERE  id = $2 ', [deleted_at, id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send({success:true, data:`MSI Has Been Deleted with ID: ${id}`})
      
    })
  }
  
  const deleteMSIDetail = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('UPDATE tbl_insaf_msi_detail set is_delete = true WHERE  id = $1 ', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send({success:true, data:`MSI Detail Has Been Deleted with ID: ${id}`})
      
    })
  }

  const deleteMSIDetailByIdParent = (request, response) => {
    var deleted_at = new Date()
    const id = parseInt(request.params.id)
    pool.query('UPDATE tbl_insaf_msi_detail set is_delete = true, deleted_at = $1 WHERE  msi_id = $2 ', [deleted_at, id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send({success:true, data:`MSI Detail Has Been Deleted with ID: ${id}`})
      
    })
  }

  const deleteMSIDetailPermanent = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM tbl_insaf_msi_detail WHERE msi_id = $1 ', [ id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send({success:true, data:`MSI Detail Has Been Deleted with ID: ${id}`})
      
    })
  }

  // insaf_msidetailxmasdexkapal
    // get all NTM detail data based on msi_id
    const getMSIDetailById = (request, response) => 
    {
      const id = parseInt(request.params.id);

      pool.query(`SELECT * FROM insaf_msidetailxmasdexuserstakeholders WHERE msi_id = $1 AND is_delete = '0';`, [id], (error, results) => 
      {
          if (error) 
          {
              throw error;
          }
          response.status(200).json(results.rows)
      })
    }

    // jenis msi //
    const readJenisMSI = (request, response) => 
    {
    
        const {page,rows} = request.body
        var page_req = page || 1
        var rows_req = rows || 3
        var offset = (page_req - 1) * rows_req
        var res = []
        var items = []
    
        pool.query('SELECT count(*) as total FROM tbl_insaf_jenis_berita_marine_safety_informasi  WHERE is_delete = false', (error, results) => {
        if (error) {
            throw error
        }
        //  console.log(results.rows[0].total)
        res.push({total:results.rows[0].total})
    
        //  var sql= 'SELECT * FROM tbl_insaf_msi ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset
        var sql= 'SELECT * FROM tbl_insaf_jenis_berita_marine_safety_informasi WHERE is_delete = false ORDER BY id ASC'
    
    
        //  var sql= 'SELECT * FROM insaf_msixmsidetail ORDER BY id ASC LIMIT '  + rows_req + ' OFFSET ' + offset (INFORMASI KAPAL)
    
        //  response.status(200).send(sql)
        pool.query(sql ,(error, results) => {
        if (error) {
            throw error
        }
        items.push({rows:results.rows})
        res.push(items)
        //response.status(200).send({success:true,data:res})
        response.status(200).send(res)
        })
    
        })
    }
  
    module.exports = {
      createMSI,
      createMSIDetail,
      getMSI, 
      getMSIById,
      getMSIByRange,
      updateMSI,
      updateMSIDetail,
      deleteMSI,
      deleteMSIDetail,
      getMSIDetailById,
      deleteMSIDetailByIdParent,
      deleteMSIDetailPermanent,
      readJenisMSI
    }