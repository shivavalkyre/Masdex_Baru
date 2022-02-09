const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
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



module.exports = {
    create,
    read,
    read_by_id,
    update,
    delete_
}